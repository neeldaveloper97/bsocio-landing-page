/**
 * ============================================
 * BSocio Landing Page - Terms of Use E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';
import { mockTermsOfUse } from '../../shared/mock-data';

test.describe('Terms of Use Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/terms');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the terms page', async ({ page }) => {
    await expect(page).toHaveURL(/\/terms/);
  });

  test('should display terms of use heading', async ({ page }) => {
    await page.waitForTimeout(1000);
    const heading = page.getByText(/terms of use/i).first();
    await expect(heading).toBeVisible();
  });

  test('should render markdown content from API', async ({ page }) => {
    await page.waitForTimeout(1500);
    const content = page.getByText(/user conduct/i);
    await expect(content.first()).toBeVisible();
  });

  test('should handle API error gracefully', async ({ page }) => {
    await page.route('**/admin-dashboard/legal/TERMS_OF_USE*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server Error' }),
      });
    });

    await page.goto('/terms');
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/terms/);
  });
});
