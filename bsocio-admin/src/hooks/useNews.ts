/**
 * ============================================
 * BSOCIO ADMIN - useNews Hook
 * ============================================
 * Custom hook for managing News articles
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/lib/api/services/news.service';
import type { NewsArticle, NewsFilters, CreateNewsRequest, UpdateNewsRequest, ImageUploadResponse } from '@/types';
import type { ApiException } from '@/lib/api/error-handler';

/**
 * Hook return interface
 */
interface UseNewsReturn {
  /** News articles data */
  data: NewsArticle[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether there was an error */
  isError: boolean;
  /** Error if any */
  error: ApiException | null;
  /** Refetch the data */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching news list
 */
export function useNews(filters?: NewsFilters): UseNewsReturn {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await newsService.getAll(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.category, filters?.search, filters?.sortBy, filters?.sortOrder]);

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
 * Hook for fetching single news article
 */
export function useNewsById(id: string) {
  const [data, setData] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await newsService.getById(id);
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
 * Hook for news mutations (create, update, archive, delete)
 */
export function useCreateNews() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateNewsRequest): Promise<NewsArticle> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await newsService.create(data);
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

export function useUpdateNews() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateNewsRequest }): Promise<NewsArticle> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await newsService.update(id, data);
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

export function useArchiveNews() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<NewsArticle> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await newsService.archive(id);
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

export function useDeleteNews() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await newsService.delete(id);
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
 * Hook for image upload
 */
export function useUploadImage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (file: File): Promise<ImageUploadResponse> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await newsService.uploadImage(file);
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
 * Hook for deleting an uploaded image
 */
export function useDeleteImage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (imageUrl: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      // Extract the key from the full URL
      // e.g., "https://bucket.s3.region.amazonaws.com/folder/filename.png" -> "folder/filename.png"
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remove leading "/"
      await newsService.deleteImage(key);
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}
