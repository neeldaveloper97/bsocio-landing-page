/**
 * ============================================
 * BSOCIO - Google Auth Service
 * ============================================
 * Service for handling Google OAuth authentication
 */

import { apiClient } from '../client';
import { tokenStorage } from '../storage';

export interface GoogleAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    isNewUser?: boolean;
  };
}

export interface GoogleUserData {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

class GoogleAuthService {
  private static instance: GoogleAuthService;

  private constructor() {}

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  /**
   * Authenticate with Google ID Token
   * Use this when you have the credential from GoogleLogin component
   */
  async authenticateWithIdToken(idToken: string): Promise<GoogleAuthResponse> {
    const response = await apiClient.post<GoogleAuthResponse>('/auth/google', {
      idToken,
    });

    if (response.data.accessToken) {
      tokenStorage.setAccessToken(response.data.accessToken);
    }
    if (response.data.refreshToken) {
      tokenStorage.setRefreshToken(response.data.refreshToken);
    }

    return response.data;
  }

  /**
   * Authenticate with Google user data
   * Use this when you have user info from useGoogleLogin hook
   */
  async authenticateWithUserData(userData: GoogleUserData): Promise<GoogleAuthResponse> {
    const response = await apiClient.post<GoogleAuthResponse>('/auth/google/callback', userData);

    if (response.data.accessToken) {
      tokenStorage.setAccessToken(response.data.accessToken);
    }
    if (response.data.refreshToken) {
      tokenStorage.setRefreshToken(response.data.refreshToken);
    }

    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.getAccessToken();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  /**
   * Logout - clear all tokens
   */
  logout(): void {
    tokenStorage.clearAll();
  }
}

export const googleAuthService = GoogleAuthService.getInstance();
