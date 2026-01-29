/**
 * ============================================
 * BSOCIO ADMIN - useCampaigns Hook
 * ============================================
 * Custom hook for managing Email Campaigns
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { campaignService } from '@/lib/api/services/campaign.service';
import type { EmailCampaign, CreateEmailCampaignRequest, EmailCampaignFilters } from '@/types';
import type { ApiException } from '@/lib/api/error-handler';

/**
 * Hook return interface
 */
interface UseCampaignsReturn {
  data: EmailCampaign[];
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching campaigns list
 */
export function useCampaigns(filters?: EmailCampaignFilters): UseCampaignsReturn {
  const [data, setData] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await campaignService.getAll(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

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
 * Hook for fetching single campaign
 */
export function useCampaignById(id: string) {
  const [data, setData] = useState<EmailCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await campaignService.getById(id);
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

/**
 * Hook for sending campaigns
 */
export function useSendCampaign() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateEmailCampaignRequest): Promise<EmailCampaign> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await campaignService.send(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for saving campaign as draft
 */
export function useSaveCampaignDraft() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateEmailCampaignRequest): Promise<EmailCampaign> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await campaignService.saveDraft(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}
