/**
 * ============================================
 * BSOCIO ADMIN - useFAQs Hook
 * ============================================
 * Custom hook for managing FAQs
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { faqService, type ApiException } from '@/lib/api';
import type { FAQ, FAQFilters, CreateFAQRequest, UpdateFAQRequest, PaginatedResponse } from '@/types';

/**
 * Hook return interface
 */
interface UseFAQsReturn {
  /** FAQs data */
  data: PaginatedResponse<FAQ> | null;
  /** All FAQs */
  faqs: FAQ[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether there was an error */
  isError: boolean;
  /** Error if any */
  error: ApiException | null;
  /** Refetch the data */
  refetch: () => Promise<void>;
  /** Create new FAQ */
  createFAQ: (data: CreateFAQRequest) => Promise<FAQ | null>;
  /** Update FAQ */
  updateFAQ: (id: string, data: UpdateFAQRequest) => Promise<FAQ | null>;
  /** Delete FAQ */
  deleteFAQ: (id: string) => Promise<boolean>;
  /** Reorder FAQs */
  reorderFAQs: (ids: string[]) => Promise<boolean>;
  /** Mutation loading state */
  isMutating: boolean;
}

/**
 * Hook options
 */
interface UseFAQsOptions {
  /** Whether to fetch on mount */
  enabled?: boolean;
  /** Filter parameters */
  filters?: FAQFilters;
}

/**
 * Custom hook for managing FAQs
 */
export function useFAQs(options: UseFAQsOptions = {}): UseFAQsReturn {
  const { enabled = true, filters } = options;

  const [data, setData] = useState<PaginatedResponse<FAQ> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await faqService.getAll(filters);
      setData(response);
    } catch (err) {
      setError(err as ApiException);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  const createFAQ = useCallback(async (createData: CreateFAQRequest): Promise<FAQ | null> => {
    setIsMutating(true);
    try {
      const faq = await faqService.create(createData);
      await fetchData(); // Refresh list
      return faq;
    } catch (err) {
      setError(err as ApiException);
      return null;
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  const updateFAQ = useCallback(async (id: string, updateData: UpdateFAQRequest): Promise<FAQ | null> => {
    setIsMutating(true);
    try {
      const faq = await faqService.update(id, updateData);
      await fetchData(); // Refresh list
      return faq;
    } catch (err) {
      setError(err as ApiException);
      return null;
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  const deleteFAQ = useCallback(async (id: string): Promise<boolean> => {
    setIsMutating(true);
    try {
      await faqService.delete(id);
      await fetchData(); // Refresh list
      return true;
    } catch (err) {
      setError(err as ApiException);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  const reorderFAQs = useCallback(async (ids: string[]): Promise<boolean> => {
    setIsMutating(true);
    try {
      await faqService.reorder({ reorderedIds: ids });
      await fetchData(); // Refresh list
      return true;
    } catch (err) {
      setError(err as ApiException);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  return {
    data,
    faqs: data?.items ?? [],
    isLoading,
    isError,
    error,
    refetch: fetchData,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
    isMutating,
  };
}
