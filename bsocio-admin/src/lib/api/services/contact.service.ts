/**
 * ============================================
 * BSOCIO ADMIN - Contact Inquiry Service
 * ============================================
 * Handles Contact Inquiry operations for admin dashboard
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  ContactInquiry,
  ContactInquiryFilters,
  ContactInquiryListResponse,
} from '@/types';

/**
 * Contact Service Class
 */
class ContactService {
  private static instance: ContactService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  /**
   * Get all contact inquiries with filters
   */
  async getAll(filters?: ContactInquiryFilters): Promise<ContactInquiryListResponse> {
    try {
      const response = await apiClient.get<ContactInquiryListResponse>(
        API_ENDPOINTS.CONTACT.BASE,
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
   * Get contact inquiry by ID
   */
  async getById(id: string): Promise<ContactInquiry> {
    try {
      const response = await apiClient.get<ContactInquiry>(
        API_ENDPOINTS.CONTACT.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const contactService = ContactService.getInstance();
export { ContactService };
