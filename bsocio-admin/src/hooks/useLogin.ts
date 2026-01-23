/**
 * ============================================
 * BSOCIO ADMIN - useLogin Hook
 * ============================================
 * Custom hook for handling admin login
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { authService, type ApiException } from '@/lib/api';
import type { LoginRequest, LoginResponse } from '@/types';

/**
 * Login options with rememberMe support
 */
interface LoginOptions {
  /** If true, tokens will be stored in localStorage for persistence */
  rememberMe?: boolean;
}

/**
 * Hook return interface
 */
interface UseLoginReturn {
  /** Execute the login */
  login: (data: LoginRequest, options?: LoginOptions) => Promise<LoginResponse | null>;
  /** Whether the login is in progress */
  isLoading: boolean;
  /** Whether the login completed successfully */
  isSuccess: boolean;
  /** Whether the login failed */
  isError: boolean;
  /** Error from the login, if any */
  error: ApiException | null;
  /** The login response data */
  data: LoginResponse | null;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Options for the useLogin hook
 */
interface UseLoginOptions {
  /** Callback when login succeeds */
  onSuccess?: (data: LoginResponse) => void;
  /** Callback when login fails */
  onError?: (error: ApiException) => void;
}

/**
 * Custom hook for handling admin login
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  // Use refs to avoid stale closures
  const onSuccessRef = useRef(options.onSuccess);
  const onErrorRef = useRef(options.onError);
  
  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
    onErrorRef.current = options.onError;
  }, [options.onSuccess, options.onError]);

  const login = useCallback(
    async (
      loginData: LoginRequest,
      loginOptions?: LoginOptions
    ): Promise<LoginResponse | null> => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      try {
        const response = await authService.login(loginData, loginOptions);
        
        setData(response);
        setIsSuccess(true);
        
        // Use ref to get latest callback
        onSuccessRef.current?.(response);
        
        return response;
      } catch (err) {
        const apiError = err as ApiException;
        setError(apiError);
        setIsError(true);
        onErrorRef.current?.(apiError);
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [] // No dependencies needed since we use refs
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setData(null);
  }, []);

  return {
    login,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    reset,
  };
}
