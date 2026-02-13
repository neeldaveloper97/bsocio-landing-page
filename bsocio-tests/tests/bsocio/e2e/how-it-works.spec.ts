/**
 * ============================================
 * BSocio Landing Page - How It Works E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('How It Works Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/how-it-works');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the how-it-works page', async ({ page }) => {
    await expect(page).toHaveURL(/\/how-it-works/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should display step-by-step content', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const text = await main.textContent();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('should display images', async ({ page }) => {
    const images = page.locator('main img');
    const count = await images.count();
    if (count > 0) {
      await expect(images.first()).toBeVisible();
    }
  });

  test('should have proper SEO meta', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
