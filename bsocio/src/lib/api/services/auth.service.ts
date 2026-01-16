/**
 * ============================================
 * BSOCIO - Authentication Service
 * ============================================
 * Handles all authentication-related API calls
 */

import { apiClient } from '../client';
import { parseApiError, ApiException } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from '@/types';

/**
 * Token storage keys
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'bsocio_access_token',
  REFRESH_TOKEN: 'bsocio_refresh_token',
  USER: 'bsocio_user',
} as const;

/**
 * Authentication Service Class
 * Follows singleton pattern for consistent state management
 */
class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ============================================
  // API Methods
  // ============================================

  /**
   * Register a new user
   * @param data - Signup request payload
   * @returns Promise with signup response
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<ApiResponse<SignupResponse>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        {
          email: data.email,
          password: data.password,
          role: data.role,
          dob: data.dob,
          isTermsAccepted: data.isTermsAccepted,
        }
      );

      const result = response.data;

      // Store user data if returned (signup typically doesn't return tokens)
      if (result.data?.user) {
        this.setUser(result.data.user);
      }

      return result.data!;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Login user with credentials
   * @param data - Login request payload
   * @returns Promise with login response
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: data.email,
          password: data.password,
        }
      );

      const result = response.data;

      // Store tokens and user data
      if (result.data?.accessToken) {
        this.setAccessToken(result.data.accessToken);
      }
      if (result.data?.refreshToken) {
        this.setRefreshToken(result.data.refreshToken);
      }
      if (result.data?.user) {
        this.setUser(result.data.user);
      }

      return result.data!;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Logout user - clear all stored data
   */
  async logout(): Promise<void> {
    try {
      // Optionally call logout endpoint if exists
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore logout API errors
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Refresh access token
   * @returns Promise with new tokens
   */
  async refreshToken(): Promise<LoginResponse | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      const result = response.data;

      // Update stored tokens
      if (result.data?.accessToken) {
        this.setAccessToken(result.data.accessToken);
      }
      if (result.data?.refreshToken) {
        this.setRefreshToken(result.data.refreshToken);
      }

      return result.data!;
    } catch (error) {
      this.clearAuthData();
      throw parseApiError(error);
    }
  }

  /**
   * Get current user profile
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.ME
      );
      return response.data.data!;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ============================================
  // Token Management
  // ============================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set access token in storage
   */
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set refresh token in storage
   */
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(TOKEN_KEYS.USER);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  /**
   * Set user data in storage
   */
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Clear all auth data from storage
   */
  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export class for testing purposes
export { AuthService };
