/**
 * ============================================
 * BSOCIO - News Service
 * ============================================
 * Service for fetching published news articles
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config';
import type { NewsArticle } from '@/types';

// Track viewed articles in current page session (resets on page refresh)
const viewedInCurrentSession = new Set<string>();

interface NewsListResponse {
  items: NewsArticle[];
  total: number;
  skip: number;
  take: number;
}

interface PaginatedNewsResponse {
  articles: NewsArticle[];
  total: number;
}

/**
 * News Service
 */
export const newsService = {
  /**
   * Get all published news articles
   */
  async getPublished(params?: { limit?: number; page?: number; category?: string }): Promise<PaginatedNewsResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.limit) {
      queryParams.take = params.limit;
    }

    if (params?.page && params?.limit) {
      queryParams.skip = (params.page - 1) * params.limit;
    }

    if (params?.category) queryParams.category = params.category;

    // Enforce published status
    queryParams.status = 'PUBLISHED';

    const response = await apiClient.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, queryParams);

    // The apiClient returns {data: {...}, status: number, ok: boolean}
    // The API returns {items: [...articles], total, skip, take}
    // So we need response.data.items to get the articles array
    const articles = Array.isArray(response.data) ? response.data : (response.data?.items || response.data?.items || []);
    const total = response.data?.total || articles.length;

    return { articles, total };
  },

  /**
   * Get news article by ID
   */
  async getById(id: string): Promise<NewsArticle> {
    // Only track if not already tracked in this page load (prevents StrictMode double-call)
    const shouldTrack = !viewedInCurrentSession.has(id);

    if (shouldTrack) {
      viewedInCurrentSession.add(id);
    }

    const queryParams = shouldTrack ? { trackView: 'true' } : {};
    const response = await apiClient.get<NewsArticle>(API_ENDPOINTS.NEWS.BY_ID(id), queryParams);

    // Handle both direct response and wrapped response
    return (response.data as any)?.data || response.data;
  },

  /**
   * Get related articles by category
   */
  async getRelatedByCategory(category: string, excludeId?: string, limit: number = 3): Promise<NewsArticle[]> {
    const response = await apiClient.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, {
      category,
      limit,
    });

    // Handle the response consistently
    // Handle the response consistently
    const articles = Array.isArray(response.data) ? response.data : (response.data?.items || response.data.items || []);

    // Filter out the current article if excludeId is provided
    if (excludeId) {
      return articles.filter(article => article.id !== excludeId).slice(0, limit);
    }
    return articles;
  },
};
