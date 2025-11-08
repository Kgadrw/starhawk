// Policies API Service
// Using centralized API configuration
import { API_BASE_URL, API_ENDPOINTS, getAuthToken } from '@/config/api';

const POLICIES_BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.POLICIES.BASE}`;

interface PolicyData {
  farmerId?: string;
  cropType?: string;
  coverageAmount?: number;
  premium?: number;
  startDate: string;
  endDate: string;
  status?: string;
  notes?: string;
  // Assessment-based policy creation (new format)
  assessmentId?: string;
  coverageLevel?: 'BASIC' | 'STANDARD' | 'PREMIUM';
  [key: string]: any;
}

interface UpdatePolicyData {
  status?: string;
  notes?: string;
  coverageAmount?: number;
  premium?: number;
  endDate?: string;
  [key: string]: any;
}

class PoliciesApiService {
  private baseURL: string;

  constructor(baseURL: string = POLICIES_BASE_URL) {
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

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('email');
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        throw new Error('Authentication required. Please log in again.');
      }

      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Policies API request failed:', error);
      throw error;
    }
  }

  // Create Policy
  // Supports both old format (farmerId, cropType, etc.) and new format (assessmentId, coverageLevel)
  async createPolicy(policyData: PolicyData) {
    // If assessmentId is provided, use new format; otherwise use old format for backward compatibility
    if (policyData.assessmentId) {
      // New assessment-based format
      const assessmentPolicyData = {
        assessmentId: policyData.assessmentId,
        coverageLevel: policyData.coverageLevel || 'STANDARD',
        startDate: policyData.startDate,
        endDate: policyData.endDate,
      };
      return this.request<any>('', {
        method: 'POST',
        body: JSON.stringify(assessmentPolicyData),
      });
    } else {
      // Old format for backward compatibility
      return this.request<any>('', {
        method: 'POST',
        body: JSON.stringify(policyData),
      });
    }
  }

  // Create Policy from Assessment (explicit method)
  async createPolicyFromAssessment(assessmentId: string, coverageLevel: 'BASIC' | 'STANDARD' | 'PREMIUM', startDate: string, endDate: string) {
    return this.createPolicy({
      assessmentId,
      coverageLevel,
      startDate,
      endDate,
    });
  }

  // Get All Policies
  async getPolicies(page: number = 1, size: number = 10, status?: string) {
    let endpoint = `?page=${page}&size=${size}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request<any>(endpoint);
  }

  // Get Policy by ID
  async getPolicyById(id: string) {
    return this.request<any>(`/${id}`);
  }

  // Update Policy
  async updatePolicy(id: string, updateData: UpdatePolicyData) {
    return this.request<any>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete Policy
  async deletePolicy(id: string) {
    return this.request<any>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const policiesApiService = new PoliciesApiService();
export default policiesApiService;

// Export convenience functions
export const createPolicy = (policyData: PolicyData) => policiesApiService.createPolicy(policyData);
export const createPolicyFromAssessment = (assessmentId: string, coverageLevel: 'BASIC' | 'STANDARD' | 'PREMIUM', startDate: string, endDate: string) => 
  policiesApiService.createPolicyFromAssessment(assessmentId, coverageLevel, startDate, endDate);
export const getPolicies = (page?: number, size?: number, status?: string) => policiesApiService.getPolicies(page, size, status);
export const getPolicyById = (id: string) => policiesApiService.getPolicyById(id);
export const updatePolicy = (id: string, updateData: UpdatePolicyData) => policiesApiService.updatePolicy(id, updateData);
export const deletePolicy = (id: string) => policiesApiService.deletePolicy(id);

