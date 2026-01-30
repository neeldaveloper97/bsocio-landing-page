/**
 * ============================================
 * BSOCIO - Token Storage Service
 * ============================================
 * Centralized token storage with consistent key management
 * Uses cookies for secure token storage
 */

/**
 * Storage keys - centralized for consistency
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bsocio_access_token',
  REFRESH_TOKEN: 'bsocio_refresh_token',
  USER: 'bsocio_user',
  REMEMBER_ME: 'bsocio_remember_me',
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
 * Token Storage Service
 * Provides a unified interface for storing and retrieving auth tokens using cookies
 */
class TokenStorage {
  private rememberMe: boolean = false;

  /**
   * Get cookie expiration days based on remember me preference
   */
  private getExpirationDays(): number {
    return this.rememberMe ? 30 : 1; // 30 days if remember me, else 1 day (session-like)
  }

  /**
   * Set remember me preference
   */
  setRememberMe(value: boolean): void {
    this.rememberMe = value;
    cookieUtils.set(STORAGE_KEYS.REMEMBER_ME, String(value), 365, false);
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

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return cookieUtils.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set access token
   */
  setAccessToken(token: string): void {
    cookieUtils.set(STORAGE_KEYS.ACCESS_TOKEN, token, this.getExpirationDays(), true);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return cookieUtils.get(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    cookieUtils.set(STORAGE_KEYS.REFRESH_TOKEN, token, this.getExpirationDays(), true);
  }

  /**
   * Get stored user
   */
  getUser<T>(): T | null {
    const userStr = cookieUtils.get(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set user
   */
  setUser<T>(user: T): void {
    cookieUtils.set(STORAGE_KEYS.USER, JSON.stringify(user), this.getExpirationDays(), false);
  }

  /**
   * Clear all auth data
   */
  clearAll(): void {
    cookieUtils.delete(STORAGE_KEYS.ACCESS_TOKEN);
    cookieUtils.delete(STORAGE_KEYS.REFRESH_TOKEN);
    cookieUtils.delete(STORAGE_KEYS.USER);
    cookieUtils.delete(STORAGE_KEYS.REMEMBER_ME);
    this.rememberMe = false;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();

export default tokenStorage;
