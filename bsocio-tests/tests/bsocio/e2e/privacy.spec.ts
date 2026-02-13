/**
 * ============================================
 * BSocio Landing Page - Privacy Policy E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';
import { mockPrivacyPolicy } from '../../shared/mock-data';

test.describe('Privacy Policy Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/privacy');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the privacy page', async ({ page }) => {
    await expect(page).toHaveURL(/\/privacy/);
  });

  test('should display privacy policy heading', async ({ page }) => {
    await page.waitForTimeout(1000);
    const heading = page.getByText(/privacy policy/i).first();
    await expect(heading).toBeVisible();
  });

  test('should render markdown content from API', async ({ page }) => {
    await page.waitForTimeout(1500);
    // The privacy policy content is rendered from markdown
    const content = page.getByText(/data collection/i);
    await expect(content.first()).toBeVisible();
  });

  test('should use legal page layout', async ({ page }) => {
    // Should have proper layout wrapper
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should handle API error gracefully', async ({ page }) => {
    await page.route('**/admin-dashboard/legal/PRIVACY_POLICY*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server Error' }),
      });
    });

    await page.goto('/privacy');
    await page.waitForTimeout(1500);
    // Should not crash
    await expect(page).toHaveURL(/\/privacy/);
  });
});
