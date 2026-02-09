/**
 * ============================================
 * BSOCIO ADMIN - Environment Configuration
 * ============================================
 * Centralized environment variable management
 */

export interface EnvConfig {
  /** API Base URL */
  apiBaseUrl: string;
  /** Is development environment */
  isDevelopment: boolean;
  /** Is production environment */
  isProduction: boolean;
  /** App name */
  appName: string;
}

/**
 * Get environment configuration
 * Uses NEXT_PUBLIC_ prefix for client-side access
 */
export function getEnvConfig(): EnvConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl && isProduction) {
    throw new Error('[Config] NEXT_PUBLIC_API_BASE_URL must be set in production');
  }

  return {
    apiBaseUrl: apiBaseUrl || 'http://localhost:7000',
    isDevelopment,
    isProduction,
    appName: 'BSocio Admin',
  };
}

/**
 * Environment configuration singleton
 */
export const env = getEnvConfig();
