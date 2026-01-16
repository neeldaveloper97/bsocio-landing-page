/**
 * ============================================
 * BSOCIO - useAuth Hook
 * ============================================
 * Central authentication state management hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, parseApiError, type ApiException } from '@/lib/api';
import type { User } from '@/types';

/**
 * Auth state interface
 */
interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: ApiException | null;
}

/**
 * Auth hook return interface
 */
interface UseAuthReturn extends UseAuthState {
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => void;
}

/**
 * Custom hook for managing authentication state
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <Dashboard user={user} onLogout={logout} />;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  /**
   * Check authentication status on mount
   */
  const checkAuth = useCallback(() => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    setState((prev) => ({
      ...prev,
      isAuthenticated,
      user,
      isLoading: false,
      isInitialized: true,
    }));
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Logout user and clear state
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const user = await authService.getCurrentUser();
      authService.setUser(user);

      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const apiError = parseApiError(error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: apiError,
      }));
    }
  }, []);

  return {
    ...state,
    logout,
    refreshUser,
    checkAuth,
  };
}
