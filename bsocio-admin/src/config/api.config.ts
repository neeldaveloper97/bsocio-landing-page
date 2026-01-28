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

  // Admin Activity
  ADMIN: {
    ACTIVITY: '/admin-dashboard/activity',
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

  // News & Media Management
  NEWS: {
    BASE: '/admin-dashboard/news',
    BY_ID: (id: string) => `/admin-dashboard/news/${id}`,
    ARCHIVE: (id: string) => `/admin-dashboard/news/${id}/archive`,
  },

  // Images (S3)
  IMAGES: {
    UPLOAD: '/images',
    DELETE: '/images',
    SIGNED_URL: '/images/signed-url',
    RAW: '/images/raw',
  },

  // Users Management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Email Campaigns
  CAMPAIGNS: {
    BASE: '/admin-dashboard/campaigns',
    BY_ID: (id: string) => `/admin-dashboard/campaigns/${id}`,
    SEND: '/admin-dashboard/campaigns/send',
    DRAFT: '/admin-dashboard/campaigns/draft',
  },

  // Contact Inquiries
  CONTACT: {
    BASE: '/contact',
    BY_ID: (id: string) => `/contact/${id}`,
  },
} as const;
