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
      // Sanitize filters to remove undefined/null/empty values
      const cleanFilters: Record<string, string | number | boolean> = {};
      
      if (filters) {
        if (filters.status) cleanFilters.status = filters.status;
        if (filters.reason) cleanFilters.reason = filters.reason;
        if (filters.skip !== undefined && filters.skip !== null) cleanFilters.skip = filters.skip;
        if (filters.take !== undefined && filters.take !== null) cleanFilters.take = filters.take;
      }

      const response = await apiClient.get<ContactInquiryListResponse>(
        API_ENDPOINTS.CONTACT.BASE,
        {
          params: cleanFilters,
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
