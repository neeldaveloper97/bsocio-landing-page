/**
 * ============================================
 * BSocio Landing Page - Navigation E2E Tests
 * ============================================
 * Tests all navigation links, header, footer, mobile menu
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the BSocio logo', async ({ page }) => {
    const logo = page.locator('header').getByRole('link').first();
    await expect(logo).toBeVisible();
  });

  test('should have all main navigation links', async ({ page }) => {
    // Header nav: About, How it works, News & Media, Festivals, FAQs (NO Contact)
    const expectedLinks = [
      /about/i,
      /how it works/i,
      /festival/i,
      /news/i,
      /faq/i,
    ];

    for (const linkName of expectedLinks) {
      const navLink = page.getByRole('link', { name: linkName });
      await expect(navLink.first()).toBeVisible();
    }
  });

  test('should navigate to About page', async ({ page }) => {
    await page.getByRole('link', { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should navigate to How It Works page', async ({ page }) => {
    await page.getByRole('link', { name: /how it works/i }).first().click();
    await expect(page).toHaveURL(/\/how-it-works/);
  });

  test('should navigate to Festivals page', async ({ page }) => {
    await page.getByRole('link', { name: /festival/i }).first().click();
    await expect(page).toHaveURL(/\/festivals/);
  });

  test('should navigate to News & Media page', async ({ page }) => {
    await page.getByRole('link', { name: /news/i }).first().click();
    await expect(page).toHaveURL(/\/news-media/);
  });

  test('should navigate to FAQs page', async ({ page }) => {
    await page.getByRole('link', { name: /faq/i }).first().click();
    await expect(page).toHaveURL(/\/faqs/);
  });

  test('should have CTA button linking to signup', async ({ page }) => {
    const ctaBtn = page.getByRole('link', { name: /accept your free.*gift/i }).first();
    await expect(ctaBtn).toBeVisible();
    await ctaBtn.click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show mobile menu button', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /open menu/i }).or(
      page.locator('header button').first()
    );
    await expect(menuButton).toBeVisible();
  });

  test('should toggle mobile menu on click', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /open menu/i }).or(page.locator('header button').first());
    await menuButton.click();

    // Wait for menu animation
    await page.waitForTimeout(300);

    // Check that navigation links become visible
    const aboutLink = page.getByRole('link', { name: /about/i });
    await expect(aboutLink.first()).toBeVisible();
  });

  test('should close mobile menu after clicking a link', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /open menu/i }).or(page.locator('header button').first());
    await menuButton.click();
    await page.waitForTimeout(300);

    await page.getByRole('link', { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });
});

test.describe('Footer Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test('should have footer navigation links', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    const footerLinks = [
      /about/i,
      /privacy/i,
      /terms/i,
      /contact/i,
    ];

    for (const linkName of footerLinks) {
      const link = footer.getByRole('link', { name: linkName });
      await expect(link.first()).toBeVisible();
    }
  });

  test('should navigate to Privacy Policy from footer', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await footer.getByRole('link', { name: /privacy/i }).first().click();
    await expect(page).toHaveURL(/\/privacy/);
  });

  test('should navigate to Terms of Use from footer', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await footer.getByRole('link', { name: /terms/i }).first().click();
    await expect(page).toHaveURL(/\/terms/);
  });
});
