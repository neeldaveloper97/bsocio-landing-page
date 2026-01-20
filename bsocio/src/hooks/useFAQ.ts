/**
 * ============================================
 * BSOCIO - useFAQ Hook
 * ============================================
 * Custom hook for fetching a single FAQ by ID
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { faqService, ApiException, parseApiError } from '@/lib/api';
import type { FAQ } from '@/types';

/**
 * Hook state interface
 */
interface UseFAQState {
  faq: FAQ | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
}

/**
 * Hook return interface
 */
interface UseFAQReturn extends UseFAQState {
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching a single FAQ by ID
 * 
 * @param id - FAQ ID
 * @example
 * ```tsx
 * const { faq, isLoading, isError } = useFAQ('cmkgo0cax0000yguqqcjv3771');
 * 
 * if (isLoading) return <Spinner />;
 * if (!faq) return <NotFound />;
 * 
 * return <FAQDetail faq={faq} />;
 * ```
 */
export function useFAQ(id: string): UseFAQReturn {
  const [state, setState] = useState<UseFAQState>({
    faq: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  /**
   * Fetch FAQ from API
   */
  const fetchFAQ = useCallback(async () => {
    if (!id) {
      setState({
        faq: null,
        isLoading: false,
        isError: true,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const faq = await faqService.getFAQById(id);

      setState({
        faq,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      const apiError = parseApiError(error);

      setState({
        faq: null,
        isLoading: false,
        isError: true,
        error: apiError,
      });
    }
  }, [id]);

  /**
   * Fetch on mount or when ID changes
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFAQ();
  }, [fetchFAQ]);

  return {
    ...state,
    refetch: fetchFAQ,
  };
}
