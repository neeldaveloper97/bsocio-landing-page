/**
 * ============================================
 * BSOCIO - useNews Hook
 * ============================================
 * Hook for fetching published news articles
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/lib/api/services/news.service';
import type { NewsArticle } from '@/types';

interface UseNewsParams {
  category?: string;
  limit?: number;
  page?: number;
}

interface UseNewsReturn {
  articles: NewsArticle[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useNews(params?: UseNewsParams): UseNewsReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await newsService.getPublished(params);
      setArticles(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch news:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.limit, params?.page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    articles,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

interface UseNewsArticleReturn {
  article: NewsArticle | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useNewsArticle(id: string): UseNewsArticleReturn {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      try {
        const result = await newsService.getById(id);
        setArticle(result);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Failed to fetch article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    article,
    isLoading,
    isError,
    error,
  };
}

interface UseRelatedArticlesReturn {
  articles: NewsArticle[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useRelatedArticles(category: string, excludeId?: string, limit: number = 3): UseRelatedArticlesReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      try {
        const result = await newsService.getRelatedByCategory(category, excludeId, limit);
        setArticles(result);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Failed to fetch related articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category, excludeId, limit]);

  return {
    articles,
    isLoading,
    isError,
    error,
  };
}
