/**
 * ============================================
 * BSOCIO ADMIN - Token Storage Service
 * ============================================
 * Centralized token and user data storage management
 * 
 * Uses cookies for secure token storage
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
 * Cookie utility functions
 */
const cookieUtils = {
  /**
   * Set a cookie
   */
  set(name: string, value: string, days: number = 7, secure: boolean = true): void {
    if (!isBrowser) return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const sameSite = secure ? 'Strict' : 'Lax';
    const secureFlag = secure && location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${secureFlag}`;
  },

  /**
   * Get a cookie value
   */
  get(name: string): string | null {
    if (!isBrowser) return null;
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  },

  /**
   * Delete a cookie
   */
  delete(name: string): void {
    if (!isBrowser) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

/**
 * Token Storage Class
 * Manages authentication tokens and user data using cookies
 */
class TokenStorageService {
  private static instance: TokenStorageService;
  private rememberMe: boolean = false;

  private constructor() {
    // Initialize rememberMe from cookie
    if (isBrowser) {
      this.rememberMe = cookieUtils.get(STORAGE_KEYS.REMEMBER_ME) === 'true';
    }
  }

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
   * Get cookie expiration days based on remember me preference
   */
  private getExpirationDays(): number {
    return this.rememberMe ? 30 : 1; // 30 days if remember me, else 1 day (session-like)
  }

  /**
   * Set remember me preference
   */
  setRememberMe(remember: boolean): void {
    this.rememberMe = remember;
    cookieUtils.set(STORAGE_KEYS.REMEMBER_ME, String(remember), 365, false);
  }

  /**
   * Get remember me preference
   */
  getRememberMe(): boolean {
    if (!isBrowser) return false;
    const value = cookieUtils.get(STORAGE_KEYS.REMEMBER_ME);
    this.rememberMe = value === 'true';
    return this.rememberMe;
  }

  // ============================================
  // Access Token Management
  // ============================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return cookieUtils.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set access token in storage
   */
  setAccessToken(token: string): void {
    cookieUtils.set(STORAGE_KEYS.ACCESS_TOKEN, token, this.getExpirationDays(), true);
  }

  /**
   * Remove access token from storage
   */
  removeAccessToken(): void {
    cookieUtils.delete(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // ============================================
  // Refresh Token Management
  // ============================================

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return cookieUtils.get(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set refresh token in storage
   */
  setRefreshToken(token: string): void {
    cookieUtils.set(STORAGE_KEYS.REFRESH_TOKEN, token, this.getExpirationDays(), true);
  }

  /**
   * Remove refresh token from storage
   */
  removeRefreshToken(): void {
    cookieUtils.delete(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // ============================================
  // User Data Management
  // ============================================

  /**
   * Get user data from storage
   */
  getUser(): StoredUser | null {
    const userData = cookieUtils.get(STORAGE_KEYS.USER);
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
    cookieUtils.set(STORAGE_KEYS.USER, JSON.stringify(user), this.getExpirationDays(), false);
  }

  /**
   * Remove user data from storage
   */
  removeUser(): void {
    cookieUtils.delete(STORAGE_KEYS.USER);
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
    cookieUtils.delete(STORAGE_KEYS.REMEMBER_ME);
    this.rememberMe = false;
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
