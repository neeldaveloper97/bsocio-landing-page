/**
 * ============================================
 * BSOCIO - Awards Service
 * ============================================
 * Handles fetching award categories, nominees, ceremonies, and special guests
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  AwardCategory,
  Nominee,
  Ceremony,
  SpecialGuest,
  AwardsStatistics,
} from '@/types';

/**
 * Awards Service Class
 */
class AwardsService {
  private static instance: AwardsService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AwardsService {
    if (!AwardsService.instance) {
      AwardsService.instance = new AwardsService();
    }
    return AwardsService.instance;
  }

  // ==================== Award Categories ====================

  /**
   * Get all active award categories
   */
  async getCategories(status?: string): Promise<AwardCategory[]> {
    try {
      const response = await apiClient.get<AwardCategory[]>(
        API_ENDPOINTS.AWARDS.CATEGORIES,
        status ? { status } : undefined
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get award category by ID with nominees
   */
  async getCategoryById(id: string): Promise<AwardCategory> {
    try {
      const response = await apiClient.get<AwardCategory>(
        API_ENDPOINTS.AWARDS.CATEGORY_BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Nominees ====================

  /**
   * Get all nominees with optional filters
   */
  async getNominees(filters?: { 
    categoryId?: string; 
    status?: string; 
    isWinner?: boolean;
  }): Promise<Nominee[]> {
    try {
      const response = await apiClient.get<Nominee[]>(
        API_ENDPOINTS.AWARDS.NOMINEES,
        filters
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get approved nominees only
   */
  async getApprovedNominees(categoryId?: string): Promise<Nominee[]> {
    return this.getNominees({ status: 'APPROVED', categoryId });
  }

  /**
   * Get winners only
   */
  async getWinners(): Promise<Nominee[]> {
    return this.getNominees({ isWinner: true });
  }

  /**
   * Get nominee by ID
   */
  async getNomineeById(id: string): Promise<Nominee> {
    try {
      const response = await apiClient.get<Nominee>(
        API_ENDPOINTS.AWARDS.NOMINEE_BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Ceremonies ====================

  /**
   * Get all ceremonies with optional status filter
   */
  async getCeremonies(status?: string): Promise<Ceremony[]> {
    try {
      const response = await apiClient.get<Ceremony[]>(
        API_ENDPOINTS.AWARDS.CEREMONIES,
        status ? { status } : undefined
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get upcoming ceremonies only
   */
  async getUpcomingCeremonies(): Promise<Ceremony[]> {
    return this.getCeremonies('UPCOMING');
  }

  /**
   * Get ceremony by ID
   */
  async getCeremonyById(id: string): Promise<Ceremony> {
    try {
      const response = await apiClient.get<Ceremony>(
        API_ENDPOINTS.AWARDS.CEREMONY_BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Special Guests ====================

  /**
   * Get all special guests with optional status filter
   */
  async getSpecialGuests(status?: string): Promise<SpecialGuest[]> {
    try {
      const response = await apiClient.get<SpecialGuest[]>(
        API_ENDPOINTS.AWARDS.GUESTS,
        status ? { status } : undefined
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get active special guests only
   */
  async getActiveGuests(): Promise<SpecialGuest[]> {
    return this.getSpecialGuests('ACTIVE');
  }

  /**
   * Get special guest by ID
   */
  async getSpecialGuestById(id: string): Promise<SpecialGuest> {
    try {
      const response = await apiClient.get<SpecialGuest>(
        API_ENDPOINTS.AWARDS.GUEST_BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Statistics ====================

  /**
   * Get awards statistics
   */
  async getStatistics(): Promise<AwardsStatistics> {
    try {
      const response = await apiClient.get<AwardsStatistics>(
        API_ENDPOINTS.AWARDS.STATISTICS
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const awardsService = AwardsService.getInstance();
export { AwardsService };
