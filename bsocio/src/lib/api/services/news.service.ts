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
  data: NewsArticle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * News Service
 */
export const newsService = {
  /**
   * Get all published news articles
   */
  async getPublished(params?: { limit?: number; page?: number; category?: string }): Promise<NewsArticle[]> {
    const queryParams: Record<string, any> = {};
    
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.page) queryParams.page = params.page;
    if (params?.category) queryParams.category = params.category;

    
    const response = await apiClient.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, queryParams);
    
    // The apiClient returns {data: {...}, status: number, ok: boolean}
    // The API returns {data: [...articles], meta: {...}}
    // So we need response.data.data to get the articles array
    const articles = response.data?.data || response.data;
    console.log('News Service - Final articles array:', articles);
    
    return articles;
  },

  /**
   * Get news article by ID
   */
  async getById(id: string): Promise<NewsArticle> {
    const response = await apiClient.get<NewsArticle>(API_ENDPOINTS.NEWS.BY_ID(id));
    return response.data;
  },

  /**
   * Get related articles by category
   */
  async getRelatedByCategory(category: string, excludeId?: string, limit: number = 3): Promise<NewsArticle[]> {
    const response = await apiClient.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, {
      category,
      limit,
    });
    
    // Filter out the current article if excludeId is provided
    const articles = response.data.data;
    if (excludeId) {
      return articles.filter(article => article.id !== excludeId).slice(0, limit);
    }
    return articles;
  },
};
