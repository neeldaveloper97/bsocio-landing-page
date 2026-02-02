/**
 * ============================================
 * BSOCIO - API Configuration
 * ============================================
 * API endpoints and configuration constants
 */

import { env } from './env';

export const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * API Endpoints
 * Centralized endpoint definitions for maintainability
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/users',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // FAQ endpoints
  FAQS: {
    BASE: '/admin-dashboard/faqs',
    BY_ID: (id: string) => `/admin-dashboard/faqs/${id}`,
  },

  // Legal endpoints
  LEGAL: {
    BY_TYPE: (type: string) => `admin-dashboard/legal/${type}`,
  },

  // Contact endpoints
  CONTACT: {
    SUBMIT: '/contact',
  },

  // News endpoints (public - no auth required)
  NEWS: {
    LIST: 'admin-dashboard/news',
    BY_ID: (id: string) => `admin-dashboard/news/${id}`,
  },

  // Events endpoints (public - no auth required)
  EVENTS: {
    LIST: 'admin-dashboard/events',
    BY_ID: (id: string) => `admin-dashboard/events/${id}`,
    STATISTICS: 'admin-dashboard/events/statistics',
  },

  // Images (S3)
  IMAGES: {
    SIGNED_URL: '/images/signed-url',
    RAW: '/images/raw',
  },

  // Other endpoints can be added here
} as const;

export default API_CONFIG;
