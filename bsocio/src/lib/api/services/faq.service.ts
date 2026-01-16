/**
 * ============================================
 * BSOCIO - FAQ Service
 * ============================================
 * Handles all FAQ-related API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type { FAQ, FAQResponse, ApiResponse } from '@/types';

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
   * Get all FAQs
   * @returns Promise with FAQ response
   */
  async getAllFAQs(): Promise<FAQResponse> {
    try {
      const response = await apiClient.get<FAQResponse>(
        API_ENDPOINTS.FAQS.BASE
      );
      
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get FAQ by ID
   * @param id - FAQ ID
   * @returns Promise with FAQ data
   */
  async getFAQById(id: string): Promise<FAQ> {
    try {
      const response = await apiClient.get<FAQ>(
        API_ENDPOINTS.FAQS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const faqService = FAQService.getInstance();

// Export class for testing purposes
export { FAQService };
