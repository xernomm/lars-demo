import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface RequestOptions extends AxiosRequestConfig {
  enableMockData?: boolean;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private enableMockData: boolean;

  constructor() {
    const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';
    const timeout = parseInt((import.meta as any).env?.VITE_API_TIMEOUT || '30000', 10);
    this.enableMockData = (import.meta as any).env?.VITE_ENABLE_MOCK_DATA === 'true';

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('[API] Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('[API] Response:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('[API] Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    if (options?.enableMockData !== false && this.enableMockData) {
      return this.getMockData<T>(url);
    }

    try {
      const response = await this.axiosInstance.get<T>(url, options);
      return response.data;
    } catch (error) {
      console.error(`[API] GET ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, options);
      return response.data;
    } catch (error) {
      console.error(`[API] POST ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, options);
      return response.data;
    } catch (error) {
      console.error(`[API] PUT ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, options);
      return response.data;
    } catch (error) {
      console.error(`[API] DELETE ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Mock data handler for development
   */
  private getMockData<T>(url: string): Promise<T> {
    console.log('[API] Using mock data for:', url);
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({} as T);
      }, 300);
    });
  }

  /**
   * Change base URL
   */
  setBaseURL(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
  }

  /**
   * Add custom header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Enable/disable mock data
   */
  setEnableMockData(enable: boolean): void {
    this.enableMockData = enable;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
