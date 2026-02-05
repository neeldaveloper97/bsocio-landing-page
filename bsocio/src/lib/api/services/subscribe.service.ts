/**
 * ============================================
 * BSOCIO - Subscribe Service
 * ============================================
 * Handles newsletter subscription API calls
 */

import { API_CONFIG, API_ENDPOINTS } from '@/config/api.config';

export interface SubscribeRequest {
  email: string;
}

export interface SubscribeResponse {
  message: string;
}

class SubscribeService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Subscribe to newsletter
   */
  async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.SUBSCRIBE.NEWSLETTER}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 409) {
        throw new Error('You are already subscribed to our newsletter!');
      }
      
      throw new Error(errorData.message || 'Failed to subscribe. Please try again.');
    }

    return response.json();
  }
}

export const subscribeService = new SubscribeService();
export { SubscribeService };
