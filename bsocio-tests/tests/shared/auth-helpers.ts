/**
 * ============================================
 * Authentication Helpers for Admin Tests
 * ============================================
 * Login/session management for authenticated test flows
 */
import { type Page, type BrowserContext } from '@playwright/test';
import { mockLoginResponse, mockAdminUser } from './mock-data';

/**
 * Set auth cookies to simulate a logged-in admin session.
 * Use this when you want to skip the login flow in tests.
 */
export async function setAdminAuthCookies(context: BrowserContext, baseURL: string) {
  const domain = new URL(baseURL).hostname;

  await context.addCookies([
    {
      name: 'bsocio_admin_access_token',
      value: mockLoginResponse.accessToken,
      domain,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    },
    {
      name: 'bsocio_admin_refresh_token',
      value: mockLoginResponse.refreshToken,
      domain,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    },
    {
      name: 'bsocio_admin_user',
      value: encodeURIComponent(JSON.stringify(mockAdminUser)),
      domain,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    },
    {
      name: 'bsocio_admin_remember_me',
      value: 'true',
      domain,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    },
  ]);
}

/**
 * Clear all auth cookies (simulate logout)
 */
export async function clearAuthCookies(context: BrowserContext) {
  await context.clearCookies();
}

/**
 * Perform a full login flow via the UI
 */
export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
}

/**
 * Check if the user is currently on an authenticated page
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const url = page.url();
  return url.includes('/dashboard');
}

/**
 * Wait for the dashboard to fully load
 */
export async function waitForDashboard(page: Page) {
  await page.waitForURL('**/dashboard**');
  await page.waitForLoadState('networkidle');
}
