// Policies API Service
// Use proxy in development to avoid CORS issues, full URL in production
const POLICIES_BASE_URL = import.meta.env.DEV
  ? '/api/v1/policies'
  : 'https://starhawk-backend-agriplatform.onrender.com/api/v1/policies';

interface PolicyData {
  farmerId: string;
  cropType: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  status?: string;
  notes?: string;
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
    return localStorage.getItem('token');
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
  async createPolicy(policyData: PolicyData) {
    return this.request<any>('', {
      method: 'POST',
      body: JSON.stringify(policyData),
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
export const getPolicies = (page?: number, size?: number, status?: string) => policiesApiService.getPolicies(page, size, status);
export const getPolicyById = (id: string) => policiesApiService.getPolicyById(id);
export const updatePolicy = (id: string, updateData: UpdatePolicyData) => policiesApiService.updatePolicy(id, updateData);
export const deletePolicy = (id: string) => policiesApiService.deletePolicy(id);

