/**
 * ============================================
 * BSOCIO ADMIN - Email Campaign Service
 * ============================================
 * Handles Email Campaign CRUD operations
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  EmailCampaign,
  CreateEmailCampaignRequest,
  EmailCampaignFilters,
} from '@/types';

/**
 * Campaign Service Class
 */
class CampaignService {
  private static instance: CampaignService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  /**
   * Get all email campaigns
   */
  async getAll(filters?: EmailCampaignFilters): Promise<EmailCampaign[]> {
    try {
      const response = await apiClient.get<EmailCampaign[]>(
        API_ENDPOINTS.CAMPAIGNS.BASE,
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
   * Get campaign by ID
   */
  async getById(id: string): Promise<EmailCampaign> {
    try {
      const response = await apiClient.get<EmailCampaign>(
        API_ENDPOINTS.CAMPAIGNS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create and send/schedule email campaign
   */
  async send(data: CreateEmailCampaignRequest): Promise<EmailCampaign> {
    try {
      const response = await apiClient.post<EmailCampaign>(
        API_ENDPOINTS.CAMPAIGNS.SEND,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Save campaign as draft
   */
  async saveDraft(data: CreateEmailCampaignRequest): Promise<EmailCampaign> {
    try {
      const response = await apiClient.post<EmailCampaign>(
        API_ENDPOINTS.CAMPAIGNS.DRAFT,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const campaignService = CampaignService.getInstance();
export { CampaignService };
