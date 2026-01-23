/**
 * ============================================
 * BSOCIO ADMIN - Token Storage Service
 * ============================================
 * Centralized token and user data storage management
 * 
 * Uses localStorage for persistence across page reloads
 */

import type { User, LoginUser } from '@/types';

/**
 * Stored user can be either full User or simplified LoginUser
 */
type StoredUser = User | LoginUser;

/**
 * Storage keys for authentication data
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bsocio_admin_access_token',
  REFRESH_TOKEN: 'bsocio_admin_refresh_token',
  USER: 'bsocio_admin_user',
  REMEMBER_ME: 'bsocio_admin_remember_me',
} as const;

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Token Storage Class
 * Manages authentication tokens and user data
 * Uses localStorage for persistence across page reloads
 */
class TokenStorageService {
  private static instance: TokenStorageService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TokenStorageService {
    if (!TokenStorageService.instance) {
      TokenStorageService.instance = new TokenStorageService();
    }
    return TokenStorageService.instance;
  }

  /**
   * Get storage - always use localStorage for reliability
   */
  private getStorage(): Storage | null {
    if (!isBrowser) return null;
    return localStorage;
  }

  /**
   * Set remember me preference (kept for API compatibility)
   */
  setRememberMe(remember: boolean): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
  }

  /**
   * Get remember me preference
   */
  getRememberMe(): boolean {
    if (!isBrowser) return false;
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  }

  // ============================================
  // Access Token Management
  // ============================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    const storage = this.getStorage();
    if (!storage) return null;
    return storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set access token in storage
   */
  setAccessToken(token: string): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Remove access token from storage
   */
  removeAccessToken(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // ============================================
  // Refresh Token Management
  // ============================================

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    const storage = this.getStorage();
    if (!storage) return null;
    return storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set refresh token in storage
   */
  setRefreshToken(token: string): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Remove refresh token from storage
   */
  removeRefreshToken(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // ============================================
  // User Data Management
  // ============================================

  /**
   * Get user data from storage
   */
  getUser(): StoredUser | null {
    const storage = this.getStorage();
    if (!storage) return null;
    
    const userData = storage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as StoredUser;
    } catch {
      return null;
    }
  }

  /**
   * Set user data in storage
   */
  setUser(user: StoredUser): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Remove user data from storage
   */
  removeUser(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Check if user is authenticated (has valid access token)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear all authentication data
   */
  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  }

  /**
   * Store all authentication data at once
   * IMPORTANT: Sets rememberMe FIRST before storing tokens
   */
  setAuthData(data: {
    accessToken: string;
    refreshToken: string;
    user: StoredUser;
    rememberMe?: boolean;
  }): void {
    if (data.rememberMe !== undefined) {
      this.setRememberMe(data.rememberMe);
    }
    this.setAccessToken(data.accessToken);
    this.setRefreshToken(data.refreshToken);
    this.setUser(data.user);
  }
}

/**
 * Export singleton instance
 */
export const tokenStorage = TokenStorageService.getInstance();
