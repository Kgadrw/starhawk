// Farms API Service
// Using centralized API configuration
import { API_BASE_URL, API_ENDPOINTS, getAuthToken } from '@/config/api';

// Direct API URL for farms
const FARMS_BASE_URL = 'https://starhawk-backend-agriplatform.onrender.com/api/v1/farms';

interface FarmData {
  name: string;
  location?: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  coordinates?: number[]; // Alternative to location.coordinates
  boundary?: {
    type: string;
    coordinates: number[][][]; // Polygon coordinates
  };
  cropType?: string;
}

interface UpdateFarmData {
  name?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  boundary?: {
    type: string;
    coordinates: number[][][];
  };
  cropType?: string;
  [key: string]: any;
}

class FarmsApiService {
  private baseURL: string;

  constructor(baseURL: string = FARMS_BASE_URL) {
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

    // Log request details for debugging
    if (options.method === 'POST' || options.method === 'PUT') {
      let bodyData = null;
      try {
        bodyData = options.body ? JSON.parse(options.body as string) : null;
      } catch (e) {
        bodyData = options.body;
      }
      
      console.log('🌐 API Request:', {
        method: options.method || 'GET',
        url: url,
        headers: Object.keys(headers),
        hasAuth: !!headers.Authorization,
        body: bodyData
      });
    }

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
        // Log the full error response for debugging
        console.error('API Error Response:', JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          url: url,
          data: data
        }, null, 2));
        
        // Try to extract more detailed error information
        const errorMessage = data.message || data.error || data.details || data.title || `HTTP error! status: ${response.status}`;
        const errorDetails = data.errors ? JSON.stringify(data.errors) : '';
        const instance = data.instance ? ` (${data.instance})` : '';
        const fullError = errorDetails ? `${errorMessage}${instance} - ${errorDetails}` : `${errorMessage}${instance}`;
        
        throw new Error(fullError);
      }

      return data;
    } catch (error) {
      console.error('Farms API request failed:', error);
      throw error;
    }
  }

  // Create New Farm
  // API: POST /api/v1/farms
  // Request body format (per API spec):
  // {
  //   "name": "Main Farm",
  //   "location": {
  //     "type": "Point",
  //     "coordinates": [longitude, latitude]
  //   },
  //   "boundary": { "type": "Polygon", "coordinates": [...] }, // Optional
  //   "cropType": "MAIZE" // Optional, uppercase
  // }
  async createFarm(farmData: FarmData) {
    // Build request body matching exact API specification
    const requestBody: any = {
      name: farmData.name,
    };

    // Use location object directly if provided, otherwise construct from coordinates
    if (farmData.location && farmData.location.type && farmData.location.coordinates) {
      requestBody.location = farmData.location;
    } else if (farmData.coordinates) {
      const coordinates = farmData.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        throw new Error('Invalid coordinates. Expected [longitude, latitude] array.');
      }
      requestBody.location = {
        type: 'Point',
        coordinates: coordinates, // [longitude, latitude] format
      };
    } else {
      throw new Error('Location is required. Provide either location object or coordinates array.');
    }

    // Add boundary if provided
    if (farmData.boundary) {
      requestBody.boundary = {
        type: 'Polygon',
        coordinates: farmData.boundary.coordinates || farmData.boundary,
      };
    }

    // Add cropType if provided (should be uppercase per API spec)
    if (farmData.cropType) {
      requestBody.cropType = farmData.cropType;
    }

    // Validate request body before sending
    if (!requestBody.name) {
      throw new Error('Farm name is required');
    }
    if (!requestBody.location || !requestBody.location.coordinates) {
      throw new Error('Location coordinates are required');
    }
    if (!requestBody.boundary || !requestBody.boundary.coordinates) {
      throw new Error('Boundary coordinates are required');
    }

    console.log('📤 Sending farm creation request (POST /api/v1/farms):', JSON.stringify(requestBody, null, 2));
    console.log('📤 Request details:', {
      url: `${this.baseURL}`,
      method: 'POST',
      hasName: !!requestBody.name,
      hasLocation: !!requestBody.location,
      locationType: requestBody.location?.type,
      locationCoordinates: requestBody.location?.coordinates,
      hasBoundary: !!requestBody.boundary,
      boundaryType: requestBody.boundary?.type,
      boundaryCoordinatesCount: requestBody.boundary?.coordinates?.[0]?.length,
      cropType: requestBody.cropType || 'Not provided'
    });

    const response = await this.request<any>('', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    console.log('✅ Farm creation API response received:', response);
    
    return response;
  }

  // List All Farms
  // GET /api/v1/farms
  // Query Parameters:
  //   - page (number, default: 0) - Page number (0-indexed)
  //   - size (number, default: 10) - Number of items per page
  async getFarms(page: number = 0, size: number = 10) {
    return this.request<any>(`?page=${page}&size=${size}`);
  }

  // Get All Farms without pagination (fallback method)
  async getAllFarms() {
    return this.request<any>(``);
  }

  // Get Farm by ID
  async getFarmById(farmId: string) {
    return this.request<any>(`/${farmId}`);
  }

  // Update Farm
  async updateFarm(farmId: string, updateData: UpdateFarmData) {
    return this.request<any>(`/${farmId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Upload Shapefile
  async uploadShapefile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/upload-shapefile`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication required. Please log in again.');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Upload KML
  async uploadKML(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/upload-kml`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication required. Please log in again.');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Create Insurance Request
  async createInsuranceRequest(farmId: string, notes?: string) {
    return this.request<any>('/insurance-requests', {
      method: 'POST',
      body: JSON.stringify({
        farmId,
        notes,
      }),
    });
  }

  // Get Insurance Requests
  async getInsuranceRequests(page: number = 1, size: number = 10, status?: string) {
    let endpoint = `/insurance-requests?page=${page}&size=${size}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request<any>(endpoint);
  }

  // Get Weather Forecast for a Farm
  async getWeatherForecast(farmId: string, startDate: string, endDate: string) {
    return this.request<any>(`/${farmId}/weather/forecast?dateStart=${startDate}&dateEnd=${endDate}`);
  }

  // Get Historical Weather
  async getHistoricalWeather(farmId: string, startDate: string, endDate: string) {
    return this.request<any>(`/${farmId}/weather/historical?dateStart=${startDate}&dateEnd=${endDate}`);
  }

  // Get Vegetation Indices Statistics
  async getVegetationStats(farmId: string, startDate: string, endDate: string, indices: string = 'NDVI,MSAVI') {
    return this.request<any>(`/${farmId}/indices/statistics?dateStart=${startDate}&dateEnd=${endDate}&indices=${indices}`);
  }
}

// Create and export a singleton instance
const farmsApiService = new FarmsApiService();
export default farmsApiService;

// Export convenience functions
export const createFarm = (farmData: FarmData) => farmsApiService.createFarm(farmData);
export const getFarms = (page?: number, size?: number) => farmsApiService.getFarms(page, size);
export const getAllFarms = () => farmsApiService.getAllFarms();
export const getFarmById = (farmId: string) => farmsApiService.getFarmById(farmId);
export const updateFarm = (farmId: string, updateData: UpdateFarmData) => farmsApiService.updateFarm(farmId, updateData);
export const uploadShapefile = (file: File) => farmsApiService.uploadShapefile(file);
export const uploadKML = (file: File) => farmsApiService.uploadKML(file);
export const createInsuranceRequest = (farmId: string, notes?: string) => farmsApiService.createInsuranceRequest(farmId, notes);
export const getInsuranceRequests = (page?: number, size?: number, status?: string) => farmsApiService.getInsuranceRequests(page, size, status);
export const getWeatherForecast = (farmId: string, startDate: string, endDate: string) => farmsApiService.getWeatherForecast(farmId, startDate, endDate);
export const getHistoricalWeather = (farmId: string, startDate: string, endDate: string) => farmsApiService.getHistoricalWeather(farmId, startDate, endDate);
export const getVegetationStats = (farmId: string, startDate: string, endDate: string, indices?: string) => farmsApiService.getVegetationStats(farmId, startDate, endDate, indices);

