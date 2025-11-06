// Admin API Service
// Use proxy in development to avoid CORS issues, full URL in production
const ADMIN_BASE_URL = import.meta.env.DEV
  ? '/api/v1/admin'
  : 'https://starhawk-backend-agriplatform.onrender.com/api/v1/admin';

class AdminApiService {
  private baseURL: string;

  constructor(baseURL: string = ADMIN_BASE_URL) {
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
      console.error('Admin API request failed:', error);
      throw error;
    }
  }

  // Get System Statistics
  async getSystemStatistics() {
    return this.request<any>('/statistics');
  }

  // Get Policy Overview
  async getPolicyOverview() {
    return this.request<any>('/policies/overview');
  }

  // Get Claim Statistics
  async getClaimStatistics() {
    return this.request<any>('/claims/statistics');
  }
}

// Create and export a singleton instance
const adminApiService = new AdminApiService();
export default adminApiService;

// Export convenience functions
export const getSystemStatistics = () => adminApiService.getSystemStatistics();
export const getPolicyOverview = () => adminApiService.getPolicyOverview();
export const getClaimStatistics = () => adminApiService.getClaimStatistics();

