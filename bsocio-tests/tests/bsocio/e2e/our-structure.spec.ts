/**
 * ============================================
 * BSocio Landing Page - Our Structure Page E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Our Structure Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/our-structure');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the our-structure page', async ({ page }) => {
    await expect(page).toHaveURL(/\/our-structure/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should display organizational structure content', async ({ page }) => {
    const main = page.locator('main');
    const text = await main.textContent();
    expect(text!.length).toBeGreaterThan(50);
  });

  test('should have proper SEO meta', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
