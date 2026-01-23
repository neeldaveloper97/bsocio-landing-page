/**
 * ============================================
 * BSOCIO - Fetch API Client
 * ============================================
 * Native fetch-based API client with interceptor-like functionality
 * for request/response handling
 */

import { API_CONFIG } from '@/config';
import { tokenStorage } from './storage';

/**
 * Request configuration options
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
  const url = new URL(endpoint, API_CONFIG.baseURL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Handle token refresh on 401 responses
 */
async function handleTokenRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    tokenStorage.setAccessToken(data.accessToken);
    tokenStorage.setRefreshToken(data.refreshToken);
    
    return data.accessToken;
  } catch {
    // Refresh failed - clear tokens
    tokenStorage.clearAll();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
}

/**
 * Make an API request with automatic token handling
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  retry = true
): Promise<ApiResponse<T>> {
  const { body, params, headers: customHeaders, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);
  const token = tokenStorage.getAccessToken();

  const headers: HeadersInit = {
    ...API_CONFIG.headers,
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Log request in development
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log(`[API Request] ${options.method || 'GET'} ${endpoint}`, { body, params });
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 - attempt token refresh
  if (response.status === 401 && retry) {
    const newToken = await handleTokenRefresh();
    if (newToken) {
      return request<T>(endpoint, options, false);
    }
  }

  const data = await response.json().catch(() => ({}));

  // Log response in development
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log(`[API Response] ${endpoint}`, { status: response.status, data });
  }

  if (!response.ok) {
    const error = new Error(data.message || `HTTP error ${response.status}`) as Error & {
      status: number;
      data: unknown;
    };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

/**
 * API Client with HTTP method helpers
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: RequestOptions['params']) =>
    request<T>(endpoint, { method: 'GET', params }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'POST', body, ...options }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'PUT', body, ...options }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'PATCH', body, ...options }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
