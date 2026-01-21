/**
 * ============================================
 * BSOCIO - useLegal Hook
 * ============================================
 * Custom hook for fetching legal content by type
 * 
 * Uses the generic useFetch pattern for consistent
 * loading, error, and automatic data fetching on mount.
 */

'use client';

import { legalService, type ApiException } from '@/lib/api';
import { useFetch, type UseFetchOptions } from './useAsync';
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
  refetch: () => Promise<LegalContent | null>;
}

/**
 * Options for the useLegal hook
 */
type UseLegalOptions = Omit<UseFetchOptions<LegalContent>, 'enabled' | 'deps'>;

/**
 * Custom hook for fetching legal content by type
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
export function useLegal(type: LegalType, options: UseLegalOptions = {}): UseLegalReturn {
  const { data, isLoading, error, refetch } = useFetch(
    () => legalService.getLegalContent(type),
    { 
      enabled: !!type, 
      deps: [type],
      ...options 
    }
  );

  return {
    legalContent: data,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}