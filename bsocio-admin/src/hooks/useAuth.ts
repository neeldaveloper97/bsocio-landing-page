/**
 * ============================================
 * BSOCIO ADMIN - useAuth Hook
 * ============================================
 * Central authentication state management hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, tokenStorage, type ApiException } from '@/lib/api';
import type { LoginUser } from '@/types';

/**
 * Auth state interface
 */
interface UseAuthState {
  /** Current authenticated user */
  user: LoginUser | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being checked */
  isLoading: boolean;
  /** Whether initial auth check is complete */
  isInitialized: boolean;
  /** Error from auth operations, if any */
  error: ApiException | null;
}

/**
 * Auth hook return interface
 */
interface UseAuthReturn extends UseAuthState {
  /** Log out the current user */
  logout: () => Promise<void>;
  /** Refresh user data from API */
  refreshUser: () => Promise<void>;
  /** Re-check authentication status */
  checkAuth: () => void;
  /** Check if user is admin */
  isAdmin: boolean;
}

/**
 * Custom hook for managing authentication state
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
   * Check authentication status from storage
   */
  const checkAuth = useCallback(() => {
    const isAuthenticated = tokenStorage.isAuthenticated();
    const user = tokenStorage.getUser();

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
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiException,
      }));
    }
  }, []);

  /**
   * Refresh user data from storage/API
   */
  const refreshUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.getCurrentUser();
      
      if (user) {
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } else {
        // No user found, not authenticated
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as ApiException,
      }));
    }
  }, []);

  const isAdmin = state.user?.role ? ['SUPER_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN', 'ANALYTICS_VIEWER'].includes(state.user.role) : false;

  return {
    ...state,
    logout,
    refreshUser,
    checkAuth,
    isAdmin,
  };
}
