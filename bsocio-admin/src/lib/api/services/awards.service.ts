/**
 * ============================================
 * BSOCIO ADMIN - Awards Service
 * ============================================
 * Handles Award Categories, Nominees, Ceremonies, and Special Guests CRUD operations
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  AwardCategory,
  CreateAwardCategoryRequest,
  UpdateAwardCategoryRequest,
  AwardCategoryFilters,
  Nominee,
  CreateNomineeRequest,
  UpdateNomineeRequest,
  NomineeFilters,
  Ceremony,
  CreateCeremonyRequest,
  UpdateCeremonyRequest,
  CeremonyFilters,
  SpecialGuest,
  CreateSpecialGuestRequest,
  UpdateSpecialGuestRequest,
  SpecialGuestFilters,
  AwardsStatistics,
  PaginatedResponse,
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
   * Get all award categories with optional filters (paginated)
   */
  async getCategories(filters?: AwardCategoryFilters): Promise<PaginatedResponse<AwardCategory>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AwardCategory>>(
        API_ENDPOINTS.AWARDS.CATEGORIES.BASE,
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
   * Get award category by ID
   */
  async getCategoryById(id: string): Promise<AwardCategory> {
    try {
      const response = await apiClient.get<AwardCategory>(
        API_ENDPOINTS.AWARDS.CATEGORIES.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new award category
   */
  async createCategory(data: CreateAwardCategoryRequest): Promise<AwardCategory> {
    try {
      const response = await apiClient.post<AwardCategory>(
        API_ENDPOINTS.AWARDS.CATEGORIES.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update award category
   */
  async updateCategory(id: string, data: UpdateAwardCategoryRequest): Promise<AwardCategory> {
    try {
      const response = await apiClient.patch<AwardCategory>(
        API_ENDPOINTS.AWARDS.CATEGORIES.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete award category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AWARDS.CATEGORIES.BY_ID(id));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Nominees ====================

  /**
   * Get all nominees with optional filters (paginated)
   */
  async getNominees(filters?: NomineeFilters): Promise<PaginatedResponse<Nominee>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Nominee>>(
        API_ENDPOINTS.AWARDS.NOMINEES.BASE,
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
   * Get nominee by ID
   */
  async getNomineeById(id: string): Promise<Nominee> {
    try {
      const response = await apiClient.get<Nominee>(
        API_ENDPOINTS.AWARDS.NOMINEES.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new nominee
   */
  async createNominee(data: CreateNomineeRequest): Promise<Nominee> {
    try {
      const response = await apiClient.post<Nominee>(
        API_ENDPOINTS.AWARDS.NOMINEES.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update nominee
   */
  async updateNominee(id: string, data: UpdateNomineeRequest): Promise<Nominee> {
    try {
      const response = await apiClient.patch<Nominee>(
        API_ENDPOINTS.AWARDS.NOMINEES.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete nominee
   */
  async deleteNominee(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AWARDS.NOMINEES.BY_ID(id));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Ceremonies ====================

  /**
   * Get all ceremonies with optional filters
   */
  async getCeremonies(filters?: CeremonyFilters): Promise<Ceremony[]> {
    try {
      const response = await apiClient.get<Ceremony[]>(
        API_ENDPOINTS.AWARDS.CEREMONIES.BASE,
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
   * Get ceremony by ID
   */
  async getCeremonyById(id: string): Promise<Ceremony> {
    try {
      const response = await apiClient.get<Ceremony>(
        API_ENDPOINTS.AWARDS.CEREMONIES.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new ceremony
   */
  async createCeremony(data: CreateCeremonyRequest): Promise<Ceremony> {
    try {
      const response = await apiClient.post<Ceremony>(
        API_ENDPOINTS.AWARDS.CEREMONIES.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update ceremony
   */
  async updateCeremony(id: string, data: UpdateCeremonyRequest): Promise<Ceremony> {
    try {
      const response = await apiClient.patch<Ceremony>(
        API_ENDPOINTS.AWARDS.CEREMONIES.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete ceremony
   */
  async deleteCeremony(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AWARDS.CEREMONIES.BY_ID(id));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  // ==================== Special Guests ====================

  /**
   * Get all special guests with optional filters (paginated)
   */
  async getSpecialGuests(filters?: SpecialGuestFilters): Promise<PaginatedResponse<SpecialGuest>> {
    try {
      const response = await apiClient.get<PaginatedResponse<SpecialGuest>>(
        API_ENDPOINTS.AWARDS.GUESTS.BASE,
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
   * Get special guest by ID
   */
  async getSpecialGuestById(id: string): Promise<SpecialGuest> {
    try {
      const response = await apiClient.get<SpecialGuest>(
        API_ENDPOINTS.AWARDS.GUESTS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new special guest
   */
  async createSpecialGuest(data: CreateSpecialGuestRequest): Promise<SpecialGuest> {
    try {
      const response = await apiClient.post<SpecialGuest>(
        API_ENDPOINTS.AWARDS.GUESTS.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update special guest
   */
  async updateSpecialGuest(id: string, data: UpdateSpecialGuestRequest): Promise<SpecialGuest> {
    try {
      const response = await apiClient.patch<SpecialGuest>(
        API_ENDPOINTS.AWARDS.GUESTS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete special guest
   */
  async deleteSpecialGuest(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AWARDS.GUESTS.BY_ID(id));
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
