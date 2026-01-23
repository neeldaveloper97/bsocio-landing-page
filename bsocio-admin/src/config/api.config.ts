/**
 * ============================================
 * BSOCIO ADMIN - API Configuration
 * ============================================
 * Centralized API endpoint configuration for admin dashboard
 */

import { env } from './env';

/**
 * API Client Configuration
 */
export const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API Endpoints for Admin Dashboard
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Admin Dashboard
  DASHBOARD: {
    OVERVIEW: '/admin-dashboard/overview',
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: '/admin-dashboard/analytics/overview',
  },

  // FAQs Management
  FAQS: {
    BASE: '/admin-dashboard/faqs',
    BY_ID: (id: string) => `/admin-dashboard/faqs/${id}`,
    REORDER: '/admin-dashboard/faqs/reorder',
  },

  // Legal Documents
  LEGAL: {
    BY_TYPE: (type: 'TERMS' | 'PRIVACY') => `/admin-dashboard/legal/${type}`,
  },

  // Users Management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
