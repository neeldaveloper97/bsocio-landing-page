/**
 * ============================================
 * BSOCIO - useFAQs Hook
 * ============================================
 * Custom hook for fetching FAQs using TanStack Query
 * 
 * Provides automatic caching, background refetching,
 * and request deduplication out of the box.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { faqService, type ApiException } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
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
  refetch: () => Promise<any>;
}

/**
 * Custom hook for fetching all FAQs
 * 
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching on window focus
 * - Request deduplication
 * - Automatic retry on failure
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
export function useFAQs(): UseFAQsReturn {
  const { data, isLoading, error, refetch } = useQuery<FAQResponse, ApiException>({
    queryKey: queryKeys.faqs.all(),
    queryFn: () => faqService.getAllFAQs(),
  });

  return {
    faqs: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    error: error ?? null,
    refetch,
  };
}
