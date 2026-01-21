/**
 * ============================================
 * BSOCIO - useLogin Hook
 * ============================================
 * Custom hook for user authentication
 * 
 * Uses the generic useMutation pattern for consistent
 * loading, error, and success state management.
 */

'use client';

import { authService, type ApiException } from '@/lib/api';
import { useMutation, type AsyncOptions } from './useAsync';
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
type UseLoginOptions = AsyncOptions<LoginResponse>;

/**
 * Custom hook for handling user login
 * 
 * @example
 * ```tsx
 * const { login, isLoading, isError, error } = useLogin({
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
  const { mutate, isLoading, isSuccess, error, data, reset } = useMutation(
    async (params: { data: LoginRequest; options?: LoginOptions }) =>
      authService.login(params.data, params.options),
    options
  );

  const login = async (
    loginData: LoginRequest,
    loginOptions?: LoginOptions
  ): Promise<LoginResponse | null> => {
    return mutate({ data: loginData, options: loginOptions });
  };

  return {
    login,
    isLoading,
    isSuccess,
    isError: !!error,
    error,
    data,
    reset,
  };
}
