/**
 * ============================================
 * BSOCIO ADMIN - News & Media Service
 * ============================================
 * Handles News/Media CRUD operations and image uploads
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  NewsArticle,
  CreateNewsRequest,
  UpdateNewsRequest,
  NewsFilters,
  ImageUploadResponse,
} from '@/types';

/**
 * News Service Class
 */
class NewsService {
  private static instance: NewsService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  /**
   * Get all news articles with optional filters
   */
  async getAll(filters?: NewsFilters): Promise<NewsArticle[]> {
    try {
      const response = await apiClient.get<NewsArticle[]>(
        API_ENDPOINTS.NEWS.BASE,
        {
          params: filters as Record<string, string | number | boolean | undefined>,
        }
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get news article by ID
   */
  async getById(id: string): Promise<NewsArticle> {
    try {
      const response = await apiClient.get<NewsArticle>(
        API_ENDPOINTS.NEWS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new news article
   */
  async create(data: CreateNewsRequest): Promise<NewsArticle> {
    try {
      const response = await apiClient.post<NewsArticle>(
        API_ENDPOINTS.NEWS.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update news article
   */
  async update(id: string, data: UpdateNewsRequest): Promise<NewsArticle> {
    try {
      const response = await apiClient.patch<NewsArticle>(
        API_ENDPOINTS.NEWS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Archive news article
   */
  async archive(id: string): Promise<NewsArticle> {
    try {
      const response = await apiClient.patch<NewsArticle>(
        API_ENDPOINTS.NEWS.ARCHIVE(id),
        {}
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete news article
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.NEWS.BY_ID(id));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Upload image to S3 via /images endpoint
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'news');

      const response = await apiClient.upload<ImageUploadResponse>(
        API_ENDPOINTS.IMAGES.UPLOAD,
        formData
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete image from S3
   */
  async deleteImage(key: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.IMAGES.DELETE, {
        params: { key },
      });
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

export const newsService = NewsService.getInstance();
