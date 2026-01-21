/**
 * ============================================
 * BSOCIO - useFAQ Hook
 * ============================================
 * Custom hook for fetching a single FAQ by ID
 * 
 * Uses the generic useFetch pattern for consistent
 * loading, error, and automatic data fetching on mount.
 */

'use client';

import { faqService, type ApiException } from '@/lib/api';
import { useFetch, type UseFetchOptions } from './useAsync';
import type { FAQ } from '@/types';

/**
 * Hook return interface
 */
interface UseFAQReturn {
  /** The FAQ data */
  faq: FAQ | null;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Whether the fetch failed */
  isError: boolean;
  /** Error from the fetch, if any */
  error: ApiException | null;
  /** Refetch the FAQ */
  refetch: () => Promise<FAQ | null>;
}

/**
 * Options for the useFAQ hook
 */
type UseFAQOptions = Omit<UseFetchOptions<FAQ>, 'enabled' | 'deps'>;

/**
 * Custom hook for fetching a single FAQ by ID
 * 
 * @param id - FAQ ID
 * @example
 * ```tsx
 * const { faq, isLoading, isError, refetch } = useFAQ('cmkgo0cax0000yguqqcjv3771');
 * 
 * if (isLoading) return <Spinner />;
 * if (!faq) return <NotFound />;
 * 
 * return <FAQDetail faq={faq} />;
 * ```
 */
export function useFAQ(id: string, options: UseFAQOptions = {}): UseFAQReturn {
  const { data, isLoading, error, refetch } = useFetch(
    () => faqService.getFAQById(id),
    { 
      enabled: !!id, 
      deps: [id],
      ...options 
    }
  );

  return {
    faq: data,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
