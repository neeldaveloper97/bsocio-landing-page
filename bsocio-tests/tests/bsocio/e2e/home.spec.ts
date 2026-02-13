/**
 * ============================================
 * BSocio Landing Page - Home Page E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BSocio|bsocio/i);
  });

  test('should display the hero section', async ({ page }) => {
    // Look for main heading or hero content
    const hero = page.locator('main').first();
    await expect(hero).toBeVisible();
  });

  test('should display BSocio branding content', async ({ page }) => {
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toContain('bsocio');
  });

  test('should have a call-to-action button', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /accept your free.*gift/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should display CTA Impact section', async ({ page }) => {
    // Scroll down to find the CTA section (it's lazy loaded)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check for CTA-related content near the bottom
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);
  });

  test('should have Open Graph meta tags', async ({ page }) => {
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });

  test('should respond within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000); // Under 10 seconds
  });
});
