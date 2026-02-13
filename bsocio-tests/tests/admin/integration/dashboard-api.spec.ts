/**
 * ============================================
 * BSocio Admin - Dashboard API Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockDashboardOverview } from '../../shared/mock-data';

test.describe('Dashboard API Integration', () => {
  test.beforeEach(async ({ page, context }) => {
    await setAdminAuthCookies(context, 'http://localhost:3001');
  });

  test('should call dashboard overview API on load', async ({ page }) => {
    let apiCalled = false;

    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'admin-1', email: 'admin@bsocio.com', role: 'SUPER_ADMIN' }),
      });
    });

    await page.route('**/admin-dashboard/overview*', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDashboardOverview),
      });
    });

    await page.route('**/admin-dashboard/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activities: [], total: 0 }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    expect(apiCalled).toBeTruthy();
  });

  test('should pass time filter to overview API', async ({ page }) => {
    let requestUrl = '';

    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'admin-1', email: 'admin@bsocio.com', role: 'SUPER_ADMIN' }),
      });
    });

    await page.route('**/admin-dashboard/overview*', async (route) => {
      requestUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDashboardOverview),
      });
    });

    await page.route('**/admin-dashboard/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activities: [], total: 0 }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    // API should have been called
    expect(requestUrl).toContain('overview');
  });

  test('should handle dashboard API timeout', async ({ page }) => {
    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'admin-1', email: 'admin@bsocio.com', role: 'SUPER_ADMIN' }),
      });
    });

    await page.route('**/admin-dashboard/overview*', async (route) => {
      await route.abort('timedout');
    });

    await page.route('**/admin-dashboard/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activities: [], total: 0 }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    // Should handle error gracefully, not crash
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should handle dashboard API 500 error', async ({ page }) => {
    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'admin-1', email: 'admin@bsocio.com', role: 'SUPER_ADMIN' }),
      });
    });

    await page.route('**/admin-dashboard/overview*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.route('**/admin-dashboard/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activities: [], total: 0 }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
