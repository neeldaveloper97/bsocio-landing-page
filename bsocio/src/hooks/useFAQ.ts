/**
 * ============================================
 * BSOCIO - useFAQ Hook
 * ============================================
 * Custom hook for fetching a single FAQ by ID using TanStack Query
 * 
 * Provides automatic caching, background refetching,
 * and request deduplication out of the box.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { faqService, type ApiException } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
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
  refetch: () => Promise<any>;
}

/**
 * Custom hook for fetching a single FAQ by ID
 * 
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching on window focus
 * - Request deduplication
 * - Automatic retry on failure
 * - Only fetches when ID is provided
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
export function useFAQ(id: string): UseFAQReturn {
  const { data, isLoading, error, refetch } = useQuery<FAQ, ApiException>({
    queryKey: queryKeys.faqs.byId(id),
    queryFn: () => faqService.getFAQById(id),
    enabled: !!id, // Only fetch when ID is provided
  });

  return {
    faq: data ?? null,
    isLoading,
    isError: !!error,
    error: error ?? null,
    refetch,
  };
}
