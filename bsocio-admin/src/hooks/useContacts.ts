/**
 * ============================================
 * BSOCIO ADMIN - useContacts Hook
 * ============================================
 * Custom hook for managing Contact Inquiries
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { contactService } from '@/lib/api/services/contact.service';
import type { ContactInquiry, ContactInquiryFilters, ContactInquiryListResponse } from '@/types';
import type { ApiException } from '@/lib/api/error-handler';

/**
 * Hook return interface
 */
interface UseContactsReturn {
  data: ContactInquiryListResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching contact inquiries list
 */
export function useContacts(filters?: ContactInquiryFilters): UseContactsReturn {
  const [data, setData] = useState<ContactInquiryListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await contactService.getAll(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.reason, filters?.skip, filters?.take]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single contact inquiry
 */
export function useContactById(id: string) {
  const [data, setData] = useState<ContactInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await contactService.getById(id);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}
