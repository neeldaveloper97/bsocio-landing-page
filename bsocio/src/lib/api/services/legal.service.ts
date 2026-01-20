/**
 * ============================================
 * BSOCIO - Legal Service
 * ============================================
 * Handles all legal-related API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type { LegalType, LegalContent } from '@/types';

/**
 * Legal Service Class
 */
class LegalService {
  private static instance: LegalService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): LegalService {
    if (!LegalService.instance) {
      LegalService.instance = new LegalService();
    }
    return LegalService.instance;
  }

  /**
   * Get legal content by type
   * @param type - Legal content type
   * @returns Promise with legal content
   */
  async getLegalContent(type: LegalType): Promise<LegalContent> {
    try {
      const response = await apiClient.get<LegalContent>(
        API_ENDPOINTS.LEGAL.BY_TYPE(type)
      );

      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const legalService = LegalService.getInstance();

// Export class for testing purposes
export { LegalService };