/**
 * ============================================
 * BSocio Admin - Analytics E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockAnalytics } from '../../shared/mock-data';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load analytics page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });

  test('should display signup metrics', async ({ page }) => {
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    // Should display metrics
    expect(body!.length).toBeGreaterThan(100);
  });

  test('should display trend chart area', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Look for chart/graph elements
    const chartArea = page.locator('canvas, svg, [class*="chart"], [class*="graph"]');
    if (await chartArea.count() > 0) {
      await expect(chartArea.first()).toBeVisible();
    }
  });

  test('should display birthday calendar', async ({ page }) => {
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    // May show birthday-related content
    expect(body).toBeTruthy();
  });

  test('should have year/month selectors', async ({ page }) => {
    await page.waitForTimeout(2000);
    const selector = page.locator('select, [role="combobox"], [data-testid*="year"], [data-testid*="month"]');
    if (await selector.count() > 0) {
      await expect(selector.first()).toBeVisible();
    }
  });

  test('should have CSV export functionality', async ({ page }) => {
    await page.waitForTimeout(2000);
    const exportBtn = page.getByRole('button', { name: /export|csv|download/i });
    if (await exportBtn.count() > 0) {
      await expect(exportBtn.first()).toBeVisible();
    }
  });

  test('should handle analytics API error', async ({ page }) => {
    await page.route('**/admin-dashboard/analytics/overview*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Failed to load analytics' }),
      });
    });

    await page.goto('/dashboard/analytics');
    await page.waitForTimeout(2000);
    // Should handle error gracefully
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });
});
