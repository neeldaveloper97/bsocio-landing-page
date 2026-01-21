/**
 * ============================================
 * BSOCIO - Authentication Service
 * ============================================
 * Handles all authentication-related API calls
 * 
 * This service is responsible for:
 * - User registration (signup)
 * - User login/logout
 * - Token refresh
 * - Current user profile
 * 
 * Token storage is delegated to the centralized tokenStorage service
 */

import { apiClient } from '../client';
import { tokenStorage } from '../storage';
import { parseApiError } from '../error-handler';
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
 * Login options for configuring session persistence
 */
interface LoginOptions {
  /** If true, tokens will be stored in localStorage for persistence */
  rememberMe?: boolean;
}

/**
 * Authentication Service Class
 * Follows singleton pattern for consistent state management
 * 
 * @example
 * ```typescript
 * // Login a user
 * const response = await authService.login({ email, password }, { rememberMe: true });
 * 
 * // Check authentication status
 * if (authService.isAuthenticated()) {
 *   const user = authService.getUser();
 * }
 * 
 * // Logout
 * await authService.logout();
 * ```
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
        tokenStorage.setUser(result.data.user);
      }

      return result.data!;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Login user with credentials
   * @param data - Login request payload
   * @param options - Login options (rememberMe)
   * @returns Promise with login response
   */
  async login(data: LoginRequest, options: LoginOptions = {}): Promise<LoginResponse> {
    try {
      // Set storage preference before storing tokens
      tokenStorage.setRememberMe(options.rememberMe ?? false);

      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: data.email,
          password: data.password,
        }
      );

      const result = response.data;

      // Store tokens and user data using centralized storage
      if (result.data?.accessToken) {
        tokenStorage.setAccessToken(result.data.accessToken);
      }
      if (result.data?.refreshToken) {
        tokenStorage.setRefreshToken(result.data.refreshToken);
      }
      if (result.data?.user) {
        tokenStorage.setUser(result.data.user);
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
      tokenStorage.clearAll();
    }
  }

  /**
   * Refresh access token
   * @returns Promise with new tokens or null if no refresh token
   */
  async refreshToken(): Promise<LoginResponse | null> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
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
        tokenStorage.setAccessToken(result.data.accessToken);
      }
      if (result.data?.refreshToken) {
        tokenStorage.setRefreshToken(result.data.refreshToken);
      }

      return result.data!;
    } catch (error) {
      tokenStorage.clearAll();
      throw parseApiError(error);
    }
  }

  /**
   * Get current user profile from API
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.ME
      );
      
      // Update cached user data
      if (response.data.data) {
        tokenStorage.setUser(response.data.data);
      }
      
      return response.data.data!;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ============================================
  // Token Management (delegated to tokenStorage)
  // ============================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken();
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    return tokenStorage.getUser() as User | null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export class for testing purposes
export { AuthService };
