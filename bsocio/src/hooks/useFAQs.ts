/**
 * ============================================
 * BSOCIO - useFAQs Hook
 * ============================================
 * Custom hook for fetching FAQs
 * 
 * Uses the generic useFetch pattern for consistent
 * loading, error, and automatic data fetching on mount.
 */

'use client';

import { faqService, type ApiException } from '@/lib/api';
import { useFetch, type UseFetchOptions } from './useAsync';
import type { FAQ, FAQResponse } from '@/types';

/**
 * Hook return interface
 */
interface UseFAQsReturn {
  /** Array of FAQ items */
  faqs: FAQ[];
  /** Total number of FAQs */
  total: number;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Whether the fetch failed */
  isError: boolean;
  /** Error from the fetch, if any */
  error: ApiException | null;
  /** Refetch the FAQs */
  refetch: () => Promise<FAQResponse | null>;
}

/**
 * Options for the useFAQs hook
 */
type UseFAQsOptions = Omit<UseFetchOptions<FAQResponse>, 'enabled'>;

/**
 * Custom hook for fetching all FAQs
 * 
 * @example
 * ```tsx
 * const { faqs, isLoading, isError, error, refetch } = useFAQs();
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error message={error?.message} />;
 * 
 * return <FAQList faqs={faqs} />;
 * ```
 */
export function useFAQs(options: UseFAQsOptions = {}): UseFAQsReturn {
  const { data, isLoading, error, refetch } = useFetch(
    () => faqService.getAllFAQs(),
    { enabled: true, ...options }
  );

  return {
    faqs: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
