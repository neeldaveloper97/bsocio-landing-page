/**
 * ============================================
 * BSOCIO - Token Storage Service
 * ============================================
 * Centralized token storage with consistent key management
 * Supports both localStorage and sessionStorage
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

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Token Storage Service
 * Provides a unified interface for storing and retrieving auth tokens
 */
class TokenStorage {
  /**
   * Get storage based on remember me preference
   */
  private getStorage(): Storage | null {
    if (!isBrowser) return null;
    
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return rememberMe === 'true' ? localStorage : sessionStorage;
  }

  /**
   * Set remember me preference
   */
  setRememberMe(value: boolean): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(value));
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (!isBrowser) return null;
    
    // Check both storages for backward compatibility
    return (
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    );
  }

  /**
   * Set access token
   */
  setAccessToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (!isBrowser) return null;
    
    return (
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    );
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  }

  /**
   * Get stored user
   */
  getUser<T>(): T | null {
    if (!isBrowser) return null;
    
    const userStr =
      localStorage.getItem(STORAGE_KEYS.USER) ||
      sessionStorage.getItem(STORAGE_KEYS.USER);

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
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }

  /**
   * Clear all auth data
   */
  clearAll(): void {
    if (!isBrowser) return;
    
    // Clear from both storages
    const keys = Object.values(STORAGE_KEYS);
    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
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
