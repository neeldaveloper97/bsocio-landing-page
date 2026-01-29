/**
 * ============================================
 * BSOCIO ADMIN - useLegal Hook
 * ============================================
 * Custom hook for managing legal documents
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  /** Number of retry attempts */
  retryCount?: number;
  /** Delay between retries in ms */
  retryDelay?: number;
}

/**
 * Sleep helper
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Custom hook for managing legal documents
 */
export function useLegal(type: LegalDocumentType, options: UseLegalOptions = {}): UseLegalReturn {
  const { enabled = true, retryCount = 3, retryDelay = 1000 } = options;

  const [data, setData] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);

    let lastError: ApiException | null = null;
    
    // Retry logic
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await legalService.getByType(type);
        
        if (!isMounted.current) return;
        
        // Handle null response (document doesn't exist yet)
        if (response === null || response === undefined) {
          setData(null);
          setIsLoading(false);
          return;
        }
        
        setData(response);
        setIsLoading(false);
        return; // Success, exit retry loop
      } catch (err) {
        lastError = err as ApiException;
        console.warn(`Legal document fetch attempt ${attempt + 1}/${retryCount} failed for ${type}:`, err);
        
        // Don't retry if it's a 404 (document doesn't exist)
        if (lastError?.statusCode === 404) {
          if (!isMounted.current) return;
          setData(null);
          setIsLoading(false);
          return;
        }
        
        // Wait before retrying (except on last attempt)
        if (attempt < retryCount - 1) {
          await sleep(retryDelay * (attempt + 1)); // Exponential backoff
        }
      }
    }
    
    // All retries failed
    if (!isMounted.current) return;
    console.error(`All ${retryCount} attempts failed for ${type}:`, lastError);
    setError(lastError);
    setIsError(true);
    setIsLoading(false);
  }, [type, retryCount, retryDelay]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  const updateDocument = useCallback(async (updateData: UpdateLegalDocumentRequest): Promise<LegalDocument | null> => {
    setIsMutating(true);
    try {
      const doc = await legalService.update(type, updateData);
      if (isMounted.current) {
        setData(doc);
      }
      return doc;
    } catch (err) {
      if (isMounted.current) {
        setError(err as ApiException);
      }
      return null;
    } finally {
      if (isMounted.current) {
        setIsMutating(false);
      }
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
