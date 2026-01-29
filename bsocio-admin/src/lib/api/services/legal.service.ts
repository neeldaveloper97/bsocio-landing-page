/**
 * ============================================
 * BSOCIO ADMIN - Legal Documents Service
 * ============================================
 * Handles legal documents (Terms & Privacy) API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  LegalDocument,
  LegalDocumentType,
  UpdateLegalDocumentRequest,
} from '@/types';

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
   * Get legal document by type
   */
  async getByType(type: LegalDocumentType): Promise<LegalDocument> {
    try {
      const response = await apiClient.get<LegalDocument>(
        API_ENDPOINTS.LEGAL.BY_TYPE(type)
      );

      // Backend returns document directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get Terms of Service
   */
  async getTerms(): Promise<LegalDocument> {
    return this.getByType('TERMS_OF_USE');
  }

  /**
   * Get Privacy Policy
   */
  async getPrivacy(): Promise<LegalDocument> {
    return this.getByType('PRIVACY_POLICY');
  }

  /**
   * Update legal document
   */
  async update(type: LegalDocumentType, data: UpdateLegalDocumentRequest): Promise<LegalDocument> {
    try {
      const response = await apiClient.put<LegalDocument>(
        API_ENDPOINTS.LEGAL.BY_TYPE(type),
        data
      );

      // Backend returns document directly
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update Terms of Service
   */
  async updateTerms(data: UpdateLegalDocumentRequest): Promise<LegalDocument> {
    return this.update('TERMS_OF_USE', data);
  }

  /**
   * Update Privacy Policy
   */
  async updatePrivacy(data: UpdateLegalDocumentRequest): Promise<LegalDocument> {
    return this.update('PRIVACY_POLICY', data);
  }
}

/**
 * Export singleton instance
 */
export const legalService = LegalService.getInstance();
export { LegalService };
