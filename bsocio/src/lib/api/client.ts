/**
 * ============================================
 * BSOCIO - Axios Client Instance
 * ============================================
 * Configured axios instance with interceptors
 * for request/response handling
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_CONFIG } from '@/config';
import { ApiError } from '@/types';

/**
 * Create configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
    withCredentials: false, // Set to true if using cookies
  });

  // ============================================
  // Request Interceptor
  // ============================================
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from storage (if available)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (process.env.NEXT_PUBLIC_ENV === 'development') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // ============================================
  // Response Interceptor
  // ============================================
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (process.env.NEXT_PUBLIC_ENV === 'development') {
        console.log(`[API Response] ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized - Token refresh logic
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // Attempt to refresh token
            const response = await axios.post(
              `${API_CONFIG.baseURL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Update tokens in storage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      }

      // Log error in development
      if (process.env.NEXT_PUBLIC_ENV === 'development') {
        console.error('[API Error]', {
          url: originalRequest?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

export default apiClient;
