/**
 * ============================================
 * BSOCIO - useLogin Hook
 * ============================================
 * Custom hook for user authentication using TanStack Query
 * 
 * Provides automatic retry, loading states, and error handling.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
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
  /** Execute the login mutation */
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
 * Custom hook for handling user login
 * 
 * Features:
 * - Automatic retry on network failures
 * - Loading and error state management
 * - Success/error callbacks
 * 
 * @example
 * ```tsx
 * const { login, isPending, isError, error } = useLogin({
 *   onSuccess: (data) => {
 *     console.log('Logged in:', data.user);
 *     router.push('/dashboard');
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   },
 * });
 * 
 * const handleSubmit = async (data: LoginRequest) => {
 *   await login(data, { rememberMe: true });
 * };
 * ```
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginReturn {
  const mutation = useMutation<
    LoginResponse,
    ApiException,
    { data: LoginRequest; options?: LoginOptions }
  >({
    mutationFn: ({ data, options: loginOptions }) =>
      authService.login(data, loginOptions),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  const login = async (
    loginData: LoginRequest,
    loginOptions?: LoginOptions
  ): Promise<LoginResponse | null> => {
    try {
      return await mutation.mutateAsync({ data: loginData, options: loginOptions });
    } catch {
      return null;
    }
  };

  return {
    login,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ?? null,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
