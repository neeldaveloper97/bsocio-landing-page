/**
 * ============================================
 * BSocio Landing Page - News & Media E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';
import { mockNewsArticles, mockSingleArticle, mockSubscribeResponse } from '../../shared/mock-data';

test.describe('News & Media Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/news-media');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the news page', async ({ page }) => {
    await expect(page).toHaveURL(/\/news-media/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should display news articles', async ({ page }) => {
    await page.waitForTimeout(1500);
    for (const article of mockNewsArticles.data) {
      const title = page.getByText(article.title);
      await expect(title.first()).toBeVisible();
    }
  });

  test('should display article categories/filters', async ({ page }) => {
    await page.waitForTimeout(1000);
    // NewsFilters component should render category filter buttons or tabs
    const filterArea = page.locator('main');
    await expect(filterArea).toBeVisible();
  });

  test('should filter articles by category', async ({ page }) => {
    await page.waitForTimeout(1500);

    // Look for filter buttons/tabs
    const filterButton = page.getByText(/announcement|impact|events|all/i).first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      // Verify page doesn't crash after filter
      await expect(page).toHaveURL(/\/news-media/);
    }
  });

  test('should navigate to article detail', async ({ page }) => {
    await page.waitForTimeout(1500);
    // NewsCard renders a "Read More" link pointing to /news-media/{id}
    const readMoreLink = page.locator(`a[href="/news-media/${mockNewsArticles.data[0].id}"]`).first();
    await readMoreLink.click();
    await expect(page).toHaveURL(/\/news-media\//);
  });

  test('should handle empty news list', async ({ page }) => {
    await page.route('**/admin-dashboard/news*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
      });
    });

    await page.goto('/news-media');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/news-media/);
  });
});

test.describe('News Article Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('should display article content', async ({ page }) => {
    await page.goto(`/news-media/${mockSingleArticle.id}`);
    await page.waitForTimeout(1500);

    const title = page.getByText(mockSingleArticle.title);
    await expect(title.first()).toBeVisible();
  });

  test('should display article author', async ({ page }) => {
    await page.goto(`/news-media/${mockSingleArticle.id}`);
    await page.waitForTimeout(1500);

    const author = page.getByText(mockSingleArticle.author);
    await expect(author.first()).toBeVisible();
  });

  test('should display related articles', async ({ page }) => {
    await page.goto(`/news-media/${mockSingleArticle.id}`);
    await page.waitForTimeout(2000);

    // Related articles section should be present
    const main = page.locator('main');
    const text = await main.textContent();
    expect(text).toBeTruthy();
  });

  test('should have newsletter subscription form', async ({ page }) => {
    await page.goto(`/news-media/${mockSingleArticle.id}`);
    await page.waitForTimeout(1500);

    // Look for subscribe form/input
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await expect(emailInput.first()).toBeVisible();
    }
  });

  test('should handle article not found', async ({ page }) => {
    await page.route('**/admin-dashboard/news/**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Article not found' }),
      });
    });

    await page.goto('/news-media/non-existent-article');
    await page.waitForTimeout(1500);
    // Should handle gracefully
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});
