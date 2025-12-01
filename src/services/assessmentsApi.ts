// Assessments API Service
// Using centralized API configuration
import { API_BASE_URL, API_ENDPOINTS, getAuthToken } from '@/config/api';

const ASSESSMENTS_BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.ASSESSMENTS.BASE}`;

interface CreateAssessmentRequest {
  farmId: string;
  assessorId: string;
}

interface UpdateAssessmentRequest {
  [key: string]: any; // Allow flexible update data
}

class AssessmentsApiService {
  private baseURL: string;

  constructor(baseURL: string = ASSESSMENTS_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return getAuthToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    // Merge existing signal with our timeout signal if it exists
    let signal = controller.signal;
    if (options.signal) {
      if (typeof AbortSignal.any === 'function') {
        signal = AbortSignal.any([controller.signal, options.signal]);
      } else {
        options.signal.addEventListener('abort', () => controller.abort());
        signal = controller.signal;
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal,
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (like HTML error pages)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          const text = await response.text();
          throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
        }
      } else {
        const text = await response.text();
        if (!response.ok) {
          if (response.status === 502) {
            throw new Error('Bad Gateway (502): The server is temporarily unavailable. Please try again in a few moments.');
          } else if (response.status === 503) {
            throw new Error('Service Unavailable (503): The server is currently down for maintenance. Please try again later.');
          } else if (response.status === 504) {
            throw new Error('Gateway Timeout (504): The server took too long to respond. Please try again.');
          } else if (response.status >= 500) {
            throw new Error(`Server Error (${response.status}): The server encountered an error. Please try again later.`);
          } else {
            const errorPreview = text.substring(0, 100).replace(/\s+/g, ' ').trim();
            throw new Error(`Server error (${response.status}): ${errorPreview || 'Unknown error'}`);
          }
        }
        throw new Error(`Unexpected response format: ${text.substring(0, 100)}`);
      }

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        throw new Error('Authentication required. Please log in again.');
      }

      if (!response.ok) {
        // Log full error response for debugging
        console.error('Assessments API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url,
          fullResponse: JSON.stringify(data, null, 2)
        });
        
        // Provide better error messages for common status codes
        if (response.status === 400) {
          let errorMessage = data.message || data.error || data.detail || data.title || 'Bad request. Please check your input.';
          
          // Try to extract detailed validation errors from various formats
          const validationMessages: string[] = [];
          
          // Format 1: errors array
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: any) => {
              if (err.field && err.message) {
                validationMessages.push(`${err.field}: ${err.message}`);
              } else if (err.path && err.message) {
                validationMessages.push(`${err.path}: ${err.message}`);
              } else if (typeof err === 'string') {
                validationMessages.push(err);
              }
            });
          }
          // Format 2: errors object
          else if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
            Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg: any) => {
                  validationMessages.push(`${field}: ${msg.message || msg.msg || msg}`);
                });
              } else if (typeof messages === 'object' && messages !== null) {
                validationMessages.push(`${field}: ${(messages as any).message || JSON.stringify(messages)}`);
              } else {
                validationMessages.push(`${field}: ${messages}`);
              }
            });
          }
          // Format 3: validationErrors
          else if (data.validationErrors) {
            if (typeof data.validationErrors === 'object') {
              if (data.validationErrors.general && Array.isArray(data.validationErrors.general)) {
                validationMessages.push(...data.validationErrors.general);
              }
              
              Object.keys(data.validationErrors).forEach((key) => {
                if (key !== 'general' && Array.isArray(data.validationErrors[key])) {
                  data.validationErrors[key].forEach((msg: string) => {
                    validationMessages.push(`${key}: ${msg}`);
                  });
                }
              });
            }
          }
          
          if (validationMessages.length > 0) {
            errorMessage += `\n\nValidation Errors:\n${validationMessages.join('\n')}`;
          } else {
            // If no specific errors found, show the full data for debugging
            errorMessage += `\n\nFull error response: ${JSON.stringify(data, null, 2)}`;
          }
          
          throw new Error(errorMessage);
        } else if (response.status === 403) {
          throw new Error(data.message || data.error || data.detail || 'Forbidden. You do not have permission to perform this action.');
        } else if (response.status === 404) {
          throw new Error(data.message || data.error || data.detail || 'Assessment not found.');
        } else if (response.status >= 500) {
          throw new Error(data.message || data.error || data.detail || `Server error (${response.status}). Please try again later.`);
        }
        throw new Error(data.message || data.error || data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('Assessments API request failed:', error);
      
      // Handle timeout/abort errors
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new Error('Request timeout. The server is taking too long to respond. Please check your connection and try again.');
      }
      
      // Re-throw with better error message if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    } finally {
      // Always clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);
    }
  }

  // Create Assessment (Insurer Only)
  async createAssessment(data: CreateAssessmentRequest) {
    console.log('Creating assessment with data:', JSON.stringify(data, null, 2));
    try {
      const response = await this.request('', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('Assessment created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Assessment creation failed:', error);
      throw error;
    }
  }

  // Get All Assessments (Role-Based)
  async getAllAssessments() {
    return this.request('');
  }

  // Get Assessments with Pagination
  // Query Parameters:
  //   - page (number, default: 0) - Page number (0-indexed)
  //   - size (number, default: 10) - Number of items per page
  async getAssessments(page: number = 0, size: number = 10) {
    return this.request<any>(`?page=${page}&size=${size}`);
  }

  // Get All Assessments without pagination (fallback method)
  async getAllAssessmentsNoPagination() {
    return this.request('');
  }

  // Get Assessment by ID
  async getAssessmentById(id: string) {
    return this.request(`/${id}`);
  }

  // Update Assessment (Assessor Only)
  async updateAssessment(id: string, updateData: UpdateAssessmentRequest) {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Calculate Risk Score (Assessor Only)
  async calculateRiskScore(id: string) {
    return this.request(`/${id}/calculate-risk`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  // Submit Assessment (Assessor Only)
  async submitAssessment(id: string) {
    return this.request(`/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
}

// Create and export a singleton instance
const assessmentsApiService = new AssessmentsApiService();
export default assessmentsApiService;

