// Farms API Service
// Use proxy in development to avoid CORS issues, full URL in production
const FARMS_BASE_URL = import.meta.env.DEV
  ? '/api/v1/farms'
  : 'https://starhawk-backend-agriplatform.onrender.com/api/v1/farms';

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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Farms API request failed:', error);
      throw error;
    }
  }

  // Create New Farm
  async createFarm(farmData: FarmData) {
    const requestBody: any = {
      name: farmData.name,
      location: {
        type: 'Point',
        coordinates: farmData.coordinates || farmData.location?.coordinates,
      },
    };

    if (farmData.boundary) {
      requestBody.boundary = farmData.boundary;
    }

    if (farmData.cropType) {
      requestBody.cropType = farmData.cropType;
    }

    return this.request<any>('', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // List All Farms
  async getFarms(page: number = 1, size: number = 10) {
    return this.request<any>(`?page=${page}&size=${size}`);
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
export const getFarmById = (farmId: string) => farmsApiService.getFarmById(farmId);
export const updateFarm = (farmId: string, updateData: UpdateFarmData) => farmsApiService.updateFarm(farmId, updateData);
export const uploadShapefile = (file: File) => farmsApiService.uploadShapefile(file);
export const uploadKML = (file: File) => farmsApiService.uploadKML(file);
export const createInsuranceRequest = (farmId: string, notes?: string) => farmsApiService.createInsuranceRequest(farmId, notes);
export const getWeatherForecast = (farmId: string, startDate: string, endDate: string) => farmsApiService.getWeatherForecast(farmId, startDate, endDate);
export const getHistoricalWeather = (farmId: string, startDate: string, endDate: string) => farmsApiService.getHistoricalWeather(farmId, startDate, endDate);
export const getVegetationStats = (farmId: string, startDate: string, endDate: string, indices?: string) => farmsApiService.getVegetationStats(farmId, startDate, endDate, indices);

