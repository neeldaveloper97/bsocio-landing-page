/**
 * ============================================
 * BSOCIO ADMIN - FAQ Service
 * ============================================
 * Handles FAQ CRUD operations
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQFilters,
  ReorderFAQRequest,
  PaginatedResponse,
} from '@/types';

/**
 * FAQ Service Class
 */
class FAQService {
  private static instance: FAQService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): FAQService {
    if (!FAQService.instance) {
      FAQService.instance = new FAQService();
    }
    return FAQService.instance;
  }

  /**
   * Get all FAQs with optional filters
   */
  async getAll(filters?: FAQFilters): Promise<PaginatedResponse<FAQ>> {
    try {
      const response = await apiClient.get<PaginatedResponse<FAQ>>(
        API_ENDPOINTS.FAQS.BASE,
        {
          params: filters as Record<string, string | number | boolean | undefined>,
        }
      );

      // Backend returns { items, total, skip, take } directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get FAQ by ID
   */
  async getById(id: string): Promise<FAQ> {
    try {
      const response = await apiClient.get<FAQ>(
        API_ENDPOINTS.FAQS.BY_ID(id)
      );

      // Backend returns FAQ object directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new FAQ
   */
  async create(data: CreateFAQRequest): Promise<FAQ> {
    try {
      const response = await apiClient.post<FAQ>(
        API_ENDPOINTS.FAQS.BASE,
        data
      );

      // Backend returns FAQ object directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update FAQ
   */
  async update(id: string, data: UpdateFAQRequest): Promise<FAQ> {
    try {
      const response = await apiClient.patch<FAQ>(
        API_ENDPOINTS.FAQS.BY_ID(id),
        data
      );

      // Backend returns FAQ object directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete FAQ
   */
  async delete(id: string): Promise<void> {
    try {
      // Backend returns { ok: true }
      await apiClient.delete(
        API_ENDPOINTS.FAQS.BY_ID(id)
      );
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Reorder FAQs
   */
  async reorder(data: ReorderFAQRequest): Promise<void> {
    try {
      // Backend returns { ok: true }
      await apiClient.post(
        API_ENDPOINTS.FAQS.REORDER,
        data
      );
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

/**
 * Export singleton instance
 */
export const faqService = FAQService.getInstance();
export { FAQService };
