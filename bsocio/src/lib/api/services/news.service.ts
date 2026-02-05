/**
 * ============================================
 * BSOCIO - News Service
 * ============================================
 * Service for fetching published news articles
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config';
import type { NewsArticle } from '@/types';

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

    if (params?.limit) queryParams.limit = params.limit;
    if (params?.page) queryParams.page = params.page;
    if (params?.category) queryParams.category = params.category;


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
    const response = await apiClient.get<NewsArticle>(API_ENDPOINTS.NEWS.BY_ID(id));
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
    const articles = Array.isArray(response.data) ? response.data : (response.data?.items || response.data.items || []);
    
    // Filter out the current article if excludeId is provided
    if (excludeId) {
      return articles.filter(article => article.id !== excludeId).slice(0, limit);
    }
    return articles;
  },
};
