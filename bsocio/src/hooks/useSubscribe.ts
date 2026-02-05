/**
 * ============================================
 * BSOCIO - useSubscribe Hook
 * ============================================
 * Hook for newsletter subscription
 */

import { useState, useCallback } from 'react';
import { subscribeService } from '@/lib/api/services';

interface UseSubscribeReturn {
  subscribe: (email: string) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useSubscribe(): UseSubscribeReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (email: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsSuccess(false);

    try {
      await subscribeService.subscribe({ email });
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  }, []);

  return {
    subscribe,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
}
