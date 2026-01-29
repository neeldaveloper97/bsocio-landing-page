/**
 * ============================================
 * BSOCIO ADMIN - useLegal Hook
 * ============================================
 * Custom hook for managing legal documents
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { legalService, type ApiException } from '@/lib/api';
import type { LegalDocument, LegalDocumentType, UpdateLegalDocumentRequest } from '@/types';

/**
 * Hook return interface
 */
interface UseLegalReturn {
  /** Legal document data */
  data: LegalDocument | null;
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether there was an error */
  isError: boolean;
  /** Error if any */
  error: ApiException | null;
  /** Refetch the data */
  refetch: () => Promise<void>;
  /** Update document */
  updateDocument: (data: UpdateLegalDocumentRequest) => Promise<LegalDocument | null>;
  /** Mutation loading state */
  isMutating: boolean;
}

/**
 * Hook options
 */
interface UseLegalOptions {
  /** Whether to fetch on mount */
  enabled?: boolean;
}

/**
 * Custom hook for managing legal documents
 */
export function useLegal(type: LegalDocumentType, options: UseLegalOptions = {}): UseLegalReturn {
  const { enabled = true } = options;

  const [data, setData] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await legalService.getByType(type);
      setData(response);
    } catch (err) {
      setError(err as ApiException);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  const updateDocument = useCallback(async (updateData: UpdateLegalDocumentRequest): Promise<LegalDocument | null> => {
    setIsMutating(true);
    try {
      const doc = await legalService.update(type, updateData);
      setData(doc);
      return doc;
    } catch (err) {
      setError(err as ApiException);
      return null;
    } finally {
      setIsMutating(false);
    }
  }, [type]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
    updateDocument,
    isMutating,
  };
}
