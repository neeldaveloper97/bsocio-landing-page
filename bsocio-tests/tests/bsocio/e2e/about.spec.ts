/**
 * ============================================
 * BSocio Landing Page - About Page E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the about page', async ({ page }) => {
    await expect(page).toHaveURL(/\/about/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 }).or(
      page.locator('h1, h2').first()
    );
    await expect(heading).toBeVisible();
  });

  test('should display about content', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const text = await main.textContent();
    expect(text!.length).toBeGreaterThan(50);
  });

  test('should display images with loading states', async ({ page }) => {
    const images = page.locator('main img');
    const count = await images.count();
    if (count > 0) {
      // Scroll to first image to trigger lazy loading and ensure visibility
      await images.first().scrollIntoViewIfNeeded();
      await expect(images.first()).toBeAttached();
      // Verify the image has a valid src attribute
      const src = await images.first().getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/about|bsocio/);
  });
});
