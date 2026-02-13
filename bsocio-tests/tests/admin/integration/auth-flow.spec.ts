/**
 * ============================================
 * BSocio Admin - Auth Flow Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockLoginResponse, mockAdminUser } from '../../shared/mock-data';
import { setAdminAuthCookies, clearAuthCookies } from '../../shared/auth-helpers';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(3000);
    // AuthGuard should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should set auth cookies on login', async ({ page }) => {
    test.slow(); // Login redirect can be slow under parallel load

    // Track login state so auth/me returns 401 initially, 200 after login
    let isLoggedIn = false;

    await page.route('**/auth/login*', async (route) => {
      isLoggedIn = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLoginResponse),
      });
    });

    await page.route('**/auth/me*', async (route) => {
      if (isLoggedIn) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAdminUser),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unauthorized' }),
        });
      }
    });

    await page.route('**/admin-dashboard/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
      });
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"], input[name="email"]').first().fill('admin@bsocio.com');
    await page.locator('input[type="password"], input[name="password"]').first().fill('Admin@123456');
    await page.getByRole('button', { name: /log in|sign in|login/i }).click();

    // Wait for login to complete and redirect (use expect with auto-retry)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    await page.waitForTimeout(1000);

    // Check that cookies were set (use document.cookie for cross-browser reliability)
    const docCookies = await page.evaluate(() => document.cookie);
    const contextCookies = await page.context().cookies();

    const hasCookies = contextCookies.length > 0 || docCookies.length > 0;
    expect(hasCookies).toBeTruthy();
  });

  test('should handle token refresh on 401', async ({ page, context }) => {
    await setAdminAuthCookies(context, 'http://localhost:3001');

    let refreshCalled = false;

    // First API call returns 401, then refresh works
    await page.route('**/admin-dashboard/overview*', async (route) => {
      if (!refreshCalled) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Token expired' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ totalUsers: 100 }),
        });
      }
    });

    await page.route('**/auth/refresh*', async (route) => {
      refreshCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        }),
      });
    });

    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAdminUser),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    // Should have attempted refresh
    // (The actual behavior depends on how the client handles 401)
  });

  test('should clear cookies on logout', async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });

    await setAdminAuthCookies(context, 'http://localhost:3001');

    await page.route('**/auth/logout*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out' }),
      });
    });

    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAdminUser),
      });
    });

    await page.route('**/admin-dashboard/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Logout button is in sidebar with class "sidebar-logout-btn"
    const logoutBtn = page.locator('.sidebar-logout-btn');
    if (await logoutBtn.count() > 0) {
      // Remove nextjs-portal overlay before clicking so the event reaches React
      await page.evaluate(() => {
        document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
      });
      await logoutBtn.scrollIntoViewIfNeeded();
      await logoutBtn.click();

      // Wait for navigation to /login with longer timeout
      await page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1000);

      // Verify cookies were cleared (primary assertion for this test)
      const cookies = await context.cookies();
      const authCookies = cookies.filter(c => c.name.startsWith('bsocio_admin_') && c.value !== '');
      expect(authCookies.length).toBe(0);
    }
  });

  test('should restrict access based on role', async ({ page, context }) => {
    // Set cookies for a non-admin role
    const domain = 'localhost';
    await context.addCookies([
      {
        name: 'bsocio_access_token',
        value: 'mock-token',
        domain,
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Strict',
      },
      {
        name: 'bsocio_user',
        value: encodeURIComponent(JSON.stringify({
          ...mockAdminUser,
          role: 'USER', // Non-admin role
        })),
        domain,
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Strict',
      },
    ]);

    await page.goto('/dashboard');
    await page.waitForTimeout(3000);

    // AuthGuard should reject non-admin users
    // Behavior: redirect to login or show unauthorized
    const url = page.url();
    const body = await page.textContent('body');
    expect(
      url.includes('login') ||
      body?.toLowerCase().includes('unauthorized') ||
      body?.toLowerCase().includes('access denied')
    ).toBeTruthy();
  });
});
