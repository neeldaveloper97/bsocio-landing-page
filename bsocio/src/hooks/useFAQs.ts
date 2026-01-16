/**
 * ============================================
 * BSOCIO - useFAQs Hook
 * ============================================
 * Custom hook for fetching FAQs
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { faqService, ApiException, parseApiError } from '@/lib/api';
import type { FAQ } from '@/types';

/**
 * Hook state interface
 */
interface UseFAQsState {
  faqs: FAQ[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
}

/**
 * Hook return interface
 */
interface UseFAQsReturn extends UseFAQsState {
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching all FAQs
 * 
 * @example
 * ```tsx
 * const { faqs, isLoading, isError, error } = useFAQs();
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error message={error?.message} />;
 * 
 * return <FAQList faqs={faqs} />;
 * ```
 */
export function useFAQs(): UseFAQsReturn {
  const [state, setState] = useState<UseFAQsState>({
    faqs: [],
    total: 0,
    isLoading: true,
    isError: false,
    error: null,
  });

  /**
   * Fetch FAQs from API
   */
  const fetchFAQs = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await faqService.getAllFAQs();

      setState({
        faqs: response.items,
        total: response.total,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      const apiError = parseApiError(error);

      setState({
        faqs: [],
        total: 0,
        isLoading: false,
        isError: true,
        error: apiError,
      });
    }
  }, []);

  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    ...state,
    refetch: fetchFAQs,
  };
}
