/**
 * ============================================
 * BSOCIO ADMIN - Authentication Service
 * ============================================
 * Handles all authentication-related API calls
 */

import { apiClient } from '../client';
import { tokenStorage } from '../storage';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  LoginRequest,
  LoginResponse,
  LoginUser,
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

  /**
   * Login admin user with credentials
   */
  async login(data: LoginRequest, options: LoginOptions = {}): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: data.email,
          password: data.password,
        },
        { withAuth: false }
      );

      // The backend returns { success, accessToken, refreshToken, user } directly
      const result = response.data;

      // Store tokens and user data
      if (result.accessToken) {
        // Set rememberMe FIRST
        tokenStorage.setRememberMe(options.rememberMe ?? true);
        
        // Then store all auth data
        tokenStorage.setAccessToken(result.accessToken);
        tokenStorage.setRefreshToken(result.refreshToken);
        tokenStorage.setUser(result.user);
      }

      return result;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Logout admin user - clear all stored data
   */
  async logout(): Promise<void> {
    try {
      // Optionally call logout endpoint if exists
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore errors on logout
    } finally {
      tokenStorage.clearAll();
    }
  }

  /**
   * Get current user profile
   * Note: If /auth/me endpoint is not available, returns cached user from storage
   */
  async getCurrentUser(): Promise<LoginUser | null> {
    // First try to get from storage (set during login)
    const cachedUser = tokenStorage.getUser();
    
    // If we have a cached user and are authenticated, return it
    if (cachedUser && this.isAuthenticated()) {
      return cachedUser as LoginUser;
    }
    
    // If no cached user, we can't get the profile without a /auth/me endpoint
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  }

  /**
   * Get stored user data
   */
  getUser(): LoginUser | null {
    return tokenStorage.getUser() as LoginUser | null;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
}

/**
 * Export singleton instance
 */
export const authService = AuthService.getInstance();
export { AuthService };
