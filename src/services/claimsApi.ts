// Claims API Service
// Use proxy in development to avoid CORS issues, full URL in production
const CLAIMS_BASE_URL = import.meta.env.DEV
  ? '/api/v1/claims'
  : 'https://starhawk-backend-agriplatform.onrender.com/api/v1/claims';

interface ClaimData {
  farmerId: string;
  policyId?: string;
  cropType: string;
  damageType: string;
  amount: number;
  description: string;
  fieldId?: string;
  evidence?: string[];
  [key: string]: any;
}

interface UpdateClaimData {
  status?: string;
  amount?: number;
  description?: string;
  notes?: string;
  approvedAmount?: number;
  [key: string]: any;
}

class ClaimsApiService {
  private baseURL: string;

  constructor(baseURL: string = CLAIMS_BASE_URL) {
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
      console.error('Claims API request failed:', error);
      throw error;
    }
  }

  // Create Claim
  async createClaim(claimData: ClaimData) {
    return this.request<any>('', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  // Get All Claims
  async getClaims(page: number = 1, size: number = 10, status?: string) {
    let endpoint = `?page=${page}&size=${size}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request<any>(endpoint);
  }

  // Get Claim by ID
  async getClaimById(id: string) {
    return this.request<any>(`/${id}`);
  }

  // Update Claim
  async updateClaim(id: string, updateData: UpdateClaimData) {
    return this.request<any>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete Claim
  async deleteClaim(id: string) {
    return this.request<any>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Approve Claim (Insurer Only)
  async approveClaim(id: string, approvedAmount?: number, notes?: string) {
    return this.request<any>(`/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({
        approvedAmount,
        notes,
      }),
    });
  }

  // Reject Claim (Insurer Only)
  async rejectClaim(id: string, reason: string) {
    return this.request<any>(`/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({
        reason,
      }),
    });
  }

  // Assign Assessor to Claim (Insurer Only)
  async assignAssessor(id: string, assessorId: string) {
    return this.request<any>(`/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({
        assessorId,
      }),
    });
  }

  // Submit Assessment for Claim (Assessor Only)
  async submitAssessment(id: string, assessmentData: any) {
    return this.request<any>(`/${id}/submit-assessment`, {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }
}

// Create and export a singleton instance
const claimsApiService = new ClaimsApiService();
export default claimsApiService;

// Export convenience functions
export const createClaim = (claimData: ClaimData) => claimsApiService.createClaim(claimData);
export const getClaims = (page?: number, size?: number, status?: string) => claimsApiService.getClaims(page, size, status);
export const getClaimById = (id: string) => claimsApiService.getClaimById(id);
export const updateClaim = (id: string, updateData: UpdateClaimData) => claimsApiService.updateClaim(id, updateData);
export const deleteClaim = (id: string) => claimsApiService.deleteClaim(id);
export const approveClaim = (id: string, approvedAmount?: number, notes?: string) => claimsApiService.approveClaim(id, approvedAmount, notes);
export const rejectClaim = (id: string, reason: string) => claimsApiService.rejectClaim(id, reason);
export const assignAssessor = (id: string, assessorId: string) => claimsApiService.assignAssessor(id, assessorId);
export const submitAssessment = (id: string, assessmentData: any) => claimsApiService.submitAssessment(id, assessmentData);

