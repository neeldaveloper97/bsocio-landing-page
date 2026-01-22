/**
 * ============================================
 * BSOCIO - useLegal Hook
 * ============================================
 * Custom hook for fetching legal content by type using TanStack Query
 * 
 * Provides automatic caching, background refetching,
 * and request deduplication out of the box.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { legalService, type ApiException } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import type { LegalType, LegalContent } from '@/types';

/**
 * Hook return interface
 */
interface UseLegalReturn {
  /** The legal content data */
  legalContent: LegalContent | null;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Whether the fetch failed */
  isError: boolean;
  /** Error from the fetch, if any */
  error: ApiException | null;
  /** Refetch the legal content */
  refetch: () => Promise<any>;
}

/**
 * Custom hook for fetching legal content by type
 *
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching on window focus
 * - Request deduplication
 * - Automatic retry on failure
 * - Only fetches when type is provided
 *
 * @param type - Legal content type
 * @example
 * ```tsx
 * const { legalContent, isLoading, isError, refetch } = useLegal('PRIVACY_POLICY');
 *
 * if (isLoading) return <Spinner />;
 * if (!legalContent) return <NotFound />;
 *
 * return <LegalContent content={legalContent.content} />;
 * ```
 */
export function useLegal(type: LegalType): UseLegalReturn {
  const { data, isLoading, error, refetch } = useQuery<LegalContent, ApiException>({
    queryKey: type === 'PRIVACY_POLICY' 
      ? queryKeys.legal.privacy() 
      : queryKeys.legal.terms(),
    queryFn: () => legalService.getLegalContent(type),
    enabled: !!type, // Only fetch when type is provided
  });

  return {
    legalContent: data ?? null,
    isLoading,
    isError: !!error,
    error: error ?? null,
    refetch,
  };
}