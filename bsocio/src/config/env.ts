/**
 * ============================================
 * BSOCIO - Environment Configuration
 * ============================================
 * Centralized environment variable management
 * with type safety and validation
 */

interface EnvConfig {
  apiBaseUrl: string;
  env: 'development' | 'staging' | 'production';
  isDev: boolean;
  isProd: boolean;
}

function getEnvConfig(): EnvConfig {
  const apiBaseUrl = "https://3qn6nvqb-7000.inc1.devtunnels.ms/";
  const env = (process.env.NEXT_PUBLIC_ENV || 'development') as EnvConfig['env'];

  if (!apiBaseUrl) {
    console.warn('[Config] NEXT_PUBLIC_API_BASE_URL is not set, using default');
  }

  return {
    apiBaseUrl: apiBaseUrl || 'http://localhost:3333',
    env,
    isDev: env === 'development',
    isProd: env === 'production',
  };
}

export const env = getEnvConfig();

export default env;
