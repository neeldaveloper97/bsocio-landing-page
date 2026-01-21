/**
 * ============================================
 * BSOCIO - Generic Async Hook
 * ============================================
 * A reusable hook for handling async operations with proper
 * loading states, error handling, and request cancellation.
 * 
 * This hook provides:
 * - Automatic loading state management
 * - Error handling with typed errors
 * - Request cancellation on unmount
 * - Success/error callbacks
 * - Reset functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiException, parseApiError } from '@/lib/api';

/**
 * State for async operations
 */
export interface AsyncState<T> {
  /** The data returned from the async operation */
  data: T | null;
  /** Whether the operation is in progress */
  isLoading: boolean;
  /** Error from the operation, if any */
  error: ApiException | null;
  /** Whether the operation completed successfully */
  isSuccess: boolean;
  /** Whether the operation has been executed at least once */
  isIdle: boolean;
}

/**
 * Options for async operations
 */
export interface AsyncOptions<T> {
  /** Callback when operation succeeds */
  onSuccess?: (data: T) => void;
  /** Callback when operation fails */
  onError?: (error: ApiException) => void;
  /** Callback when operation completes (success or error) */
  onSettled?: () => void;
  /** Initial data value */
  initialData?: T | null;
}

/**
 * Return type for useAsync hook
 */
export interface UseAsyncReturn<T, TParams extends unknown[]> {
  /** Current state of the async operation */
  state: AsyncState<T>;
  /** Execute the async operation */
  execute: (...params: TParams) => Promise<T | null>;
  /** Reset state to initial values */
  reset: () => void;
  /** The data returned from the async operation */
  data: T | null;
  /** Whether the operation is in progress */
  isLoading: boolean;
  /** Error from the operation, if any */
  error: ApiException | null;
  /** Whether the operation completed successfully */
  isSuccess: boolean;
}

/**
 * Generic async hook for handling API calls and other async operations
 * 
 * @example
 * ```typescript
 * // Simple usage
 * const { execute, isLoading, data, error } = useAsync(
 *   async (id: string) => await userService.getUser(id)
 * );
 * 
 * // With options
 * const { execute, isLoading } = useAsync(
 *   async (data: SignupData) => await authService.signup(data),
 *   {
 *     onSuccess: (result) => console.log('Signed up!', result),
 *     onError: (error) => console.error('Failed:', error.message),
 *   }
 * );
 * 
 * // Execute the operation
 * await execute({ email: 'test@example.com', password: '...' });
 * ```
 */
export function useAsync<T, TParams extends unknown[] = []>(
  asyncFn: (...params: TParams) => Promise<T>,
  options: AsyncOptions<T> = {}
): UseAsyncReturn<T, TParams> {
  const { onSuccess, onError, onSettled, initialData = null } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isSuccess: false,
    isIdle: true,
  });

  // Keep track of the current request to handle race conditions
  const requestIdRef = useRef(0);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...params: TParams): Promise<T | null> => {
      // Increment request ID to track the latest request
      const currentRequestId = ++requestIdRef.current;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isIdle: false,
      }));

      try {
        const result = await asyncFn(...params);

        // Only update state if this is still the latest request and component is mounted
        if (currentRequestId === requestIdRef.current && isMountedRef.current) {
          setState({
            data: result,
            isLoading: false,
            error: null,
            isSuccess: true,
            isIdle: false,
          });
          onSuccess?.(result);
        }

        return result;
      } catch (error) {
        const apiError = parseApiError(error);

        // Only update state if this is still the latest request and component is mounted
        if (currentRequestId === requestIdRef.current && isMountedRef.current) {
          setState({
            data: null,
            isLoading: false,
            error: apiError,
            isSuccess: false,
            isIdle: false,
          });
          onError?.(apiError);
        }

        return null;
      } finally {
        if (currentRequestId === requestIdRef.current && isMountedRef.current) {
          onSettled?.();
        }
      }
    },
    [asyncFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    requestIdRef.current++;
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      isSuccess: false,
      isIdle: true,
    });
  }, [initialData]);

  return {
    state,
    execute,
    reset,
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    isSuccess: state.isSuccess,
  };
}

/**
 * Hook for fetching data on mount with automatic refetch capability
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error, refetch } = useFetch(
 *   () => faqService.getAllFAQs(),
 *   { enabled: true }
 * );
 * ```
 */
export interface UseFetchOptions<T> extends AsyncOptions<T> {
  /** Whether to fetch on mount (default: true) */
  enabled?: boolean;
  /** Dependencies that trigger a refetch when changed */
  deps?: unknown[];
}

export interface UseFetchReturn<T> {
  /** The fetched data */
  data: T | null;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Error from the fetch, if any */
  error: ApiException | null;
  /** Whether the fetch completed successfully */
  isSuccess: boolean;
  /** Refetch the data */
  refetch: () => Promise<T | null>;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { enabled = true, deps = [], ...asyncOptions } = options;

  const { execute, data, isLoading, error, isSuccess } = useAsync(fetchFn, asyncOptions);

  // Track if initial fetch has been done
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (enabled) {
      initialFetchDone.current = true;
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return {
    data,
    isLoading,
    error,
    isSuccess,
    refetch: execute,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE operations)
 * 
 * @example
 * ```typescript
 * const { mutate, isLoading, error } = useMutation(
 *   async (data: SignupData) => await authService.signup(data),
 *   {
 *     onSuccess: () => router.push('/dashboard'),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * 
 * // In a form handler
 * const handleSubmit = async (data: SignupData) => {
 *   await mutate(data);
 * };
 * ```
 */
export interface UseMutationReturn<T, TParams extends unknown[]> {
  /** Execute the mutation */
  mutate: (...params: TParams) => Promise<T | null>;
  /** Whether the mutation is in progress */
  isLoading: boolean;
  /** Error from the mutation, if any */
  error: ApiException | null;
  /** Whether the mutation completed successfully */
  isSuccess: boolean;
  /** The result data from the mutation */
  data: T | null;
  /** Reset the mutation state */
  reset: () => void;
}

export function useMutation<T, TParams extends unknown[] = []>(
  mutationFn: (...params: TParams) => Promise<T>,
  options: AsyncOptions<T> = {}
): UseMutationReturn<T, TParams> {
  const { execute, data, isLoading, error, isSuccess, reset } = useAsync(
    mutationFn,
    options
  );

  return {
    mutate: execute,
    isLoading,
    error,
    isSuccess,
    data,
    reset,
  };
}
