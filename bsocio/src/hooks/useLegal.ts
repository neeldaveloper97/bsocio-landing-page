/**
 * ============================================
 * BSOCIO - useLegal Hook
 * ============================================
 * Custom hook for fetching legal content by type
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { legalService, ApiException, parseApiError } from '@/lib/api';
import type { LegalType, LegalContent } from '@/types';

/**
 * Hook state interface
 */
interface UseLegalState {
  legalContent: LegalContent | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
}

/**
 * Hook return interface
 */
interface UseLegalReturn extends UseLegalState {
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching legal content by type
 *
 * @param type - Legal content type
 * @example
 * ```tsx
 * const { legalContent, isLoading, isError } = useLegal('PRIVACY_POLICY');
 *
 * if (isLoading) return <Spinner />;
 * if (!legalContent) return <NotFound />;
 *
 * return <LegalContent content={legalContent.content} />;
 * ```
 */
export function useLegal(type: LegalType): UseLegalReturn {
  const [state, setState] = useState<UseLegalState>({
    legalContent: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  /**
   * Fetch legal content from API
   */
  const fetchLegalContent = useCallback(async () => {
    if (!type) {
      setState({
        legalContent: null,
        isLoading: false,
        isError: true,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const legalContent = await legalService.getLegalContent(type);

      setState({
        legalContent,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      const apiError = parseApiError(error);

      setState({
        legalContent: null,
        isLoading: false,
        isError: true,
        error: apiError,
      });
    }
  }, [type]);

  /**
   * Fetch on mount or when type changes
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLegalContent();
  }, [fetchLegalContent]);

  return {
    ...state,
    refetch: fetchLegalContent,
  };
}