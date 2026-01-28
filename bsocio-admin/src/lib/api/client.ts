/**
 * ============================================
 * BSOCIO ADMIN - API Client
 * ============================================
 * Centralized fetch-based API client with:
 * - Automatic token injection
 * - Token refresh on 401
 * - Error handling
 * - Request/Response interceptors
 */

import { API_CONFIG, API_ENDPOINTS } from '@/config';
import { tokenStorage } from './storage';
import { parseApiError, ApiException, ERROR_CODES } from './error-handler';
import type { RefreshTokenResponse } from '@/types';

/**
 * API Client Response wrapper
 */
interface ClientResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Request configuration
 */
interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  withAuth?: boolean;
  timeout?: number;
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, API_CONFIG.baseURL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Create headers with optional auth token
 */
function createHeaders(
  customHeaders?: Record<string, string>,
  withAuth: boolean = true
): Headers {
  const headers = new Headers({
    ...API_CONFIG.headers,
    ...customHeaders,
  });

  if (withAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
}

/**
 * Flag to prevent multiple refresh attempts
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token
 */
async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: createHeaders(undefined, false),
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      // Backend returns { success, accessToken, refreshToken, user } directly
      const result = (await response.json()) as RefreshTokenResponse;

      if (result.accessToken) {
        tokenStorage.setAccessToken(result.accessToken);
        if (result.refreshToken) {
          tokenStorage.setRefreshToken(result.refreshToken);
        }
        return true;
      }

      return false;
    } catch {
      // Clear tokens on refresh failure
      tokenStorage.clearAll();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Make HTTP request with automatic token handling
 */
async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<ClientResponse<T>> {
  const { headers: customHeaders, params, withAuth = true, timeout = API_CONFIG.timeout } = config;

  const url = buildUrl(endpoint, params);
  const headers = createHeaders(customHeaders, withAuth);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(body);
    }

    let response = await fetch(url, fetchOptions);

    // Handle 401 - attempt token refresh
    if (response.status === 401 && withAuth) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Retry request with new token
        const newHeaders = createHeaders(customHeaders, true);
        response = await fetch(url, {
          ...fetchOptions,
          headers: newHeaders,
        });
      } else {
        // Redirect to login on refresh failure
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new ApiException(
          'Session expired. Please login again.',
          ERROR_CODES.UNAUTHORIZED,
          401
        );
      }
    }

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw parseApiError({
        ...data,
        statusCode: response.status,
      });
    }

    return {
      data: data as T,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiException(
        'Request timed out. Please try again.',
        ERROR_CODES.TIMEOUT,
        0
      );
    }

    throw parseApiError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * API Client with HTTP method helpers
 */
export const apiClient = {
  /**
   * GET request
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<ClientResponse<T>> {
    return request<T>('GET', endpoint, undefined, config);
  },

  /**
   * POST request
   */
  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ClientResponse<T>> {
    return request<T>('POST', endpoint, body, config);
  },

  /**
   * PUT request
   */
  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ClientResponse<T>> {
    return request<T>('PUT', endpoint, body, config);
  },

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ClientResponse<T>> {
    return request<T>('PATCH', endpoint, body, config);
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<ClientResponse<T>> {
    return request<T>('DELETE', endpoint, undefined, config);
  },

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<ClientResponse<T>> {
    const { withAuth = true, timeout = API_CONFIG.timeout } = config || {};

    const url = buildUrl(endpoint, config?.params);

    // Create headers WITHOUT Content-Type (browser sets it with boundary for FormData)
    const headers = new Headers();
    if (withAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      // Handle 401 - attempt token refresh
      if (response.status === 401 && withAuth) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          const newHeaders = new Headers();
          const token = tokenStorage.getAccessToken();
          if (token) {
            newHeaders.set('Authorization', `Bearer ${token}`);
          }
          response = await fetch(url, {
            method: 'POST',
            headers: newHeaders,
            body: formData,
          });
        } else {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiException(
            'Session expired. Please login again.',
            ERROR_CODES.UNAUTHORIZED,
            401
          );
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw parseApiError({
          ...data,
          statusCode: response.status,
        });
      }

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiException(
          'Request timed out. Please try again.',
          ERROR_CODES.TIMEOUT,
          0
        );
      }

      throw parseApiError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
