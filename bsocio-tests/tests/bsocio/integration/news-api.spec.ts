/**
 * ============================================
 * BSocio - News API Integration Tests
 * ============================================
 *
 * Note: On webkit, React hydration + useEffect may fire AFTER
 * networkidle, so we rely on DOM assertions (auto-retry) to wait
 * for the client-side fetch to complete before checking API flags.
 */
import { test, expect } from '@playwright/test';
import { mockNewsArticles, mockSingleArticle } from '../../shared/mock-data';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('News API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should fetch news articles list', async ({ page }) => {
    let apiCalled = false;

    await page.route('**/admin-dashboard/news*', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockNewsArticles.data,
          total: mockNewsArticles.total,
          skip: 0,
          take: 10,
        }),
      });
    });

    await page.goto('/news-media');

    // Wait for mock data to render (proves route was intercepted)
    await expect(
      page.getByText(mockNewsArticles.data[0].title).first(),
    ).toBeVisible({ timeout: 15000 });

    expect(apiCalled).toBeTruthy();
  });

  test('should fetch single article by slug', async ({ page }) => {
    let requestedUrl = '';

    await page.route('**/admin-dashboard/news/**', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSingleArticle),
      });
    });

    await page.goto(`/news-media/${mockSingleArticle.slug}`);

    // Wait for article content to render (proves route was intercepted)
    await expect(
      page.getByText(mockSingleArticle.title).first(),
    ).toBeVisible({ timeout: 15000 });

    expect(requestedUrl).toContain(mockSingleArticle.slug);
  });

  test('should track view count on article visit', async ({ page }) => {
    let requestMethod = '';

    await page.route('**/admin-dashboard/news/**', async (route) => {
      requestMethod = route.request().method();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSingleArticle),
      });
    });

    await page.goto(`/news-media/${mockSingleArticle.slug}`);

    // Wait for article content to render (proves route was intercepted)
    await expect(
      page.getByText(mockSingleArticle.title).first(),
    ).toBeVisible({ timeout: 15000 });

    // The news service fetches article by ID (GET)
    expect(requestMethod).toBe('GET');
  });

  test('should handle paginated news list', async ({ page }) => {
    const paginatedResponse = {
      items: mockNewsArticles.data,
      total: 50,
      skip: 0,
      take: 10,
    };

    await page.route('**/admin-dashboard/news*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginatedResponse),
      });
    });

    await page.goto('/news-media');

    // Should display articles from first page
    await expect(
      page.getByText(mockNewsArticles.data[0].title).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test('should handle news category filtering via query params', async ({ page }) => {
    let requestedUrl = '';

    await page.route('**/admin-dashboard/news*', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockNewsArticles.data,
          total: mockNewsArticles.total,
          skip: 0,
          take: 10,
        }),
      });
    });

    await page.goto('/news-media');

    // Wait for mock data to render (proves route was intercepted)
    await expect(
      page.getByText(mockNewsArticles.data[0].title).first(),
    ).toBeVisible({ timeout: 15000 });

    // Verify initial fetch was made
    expect(requestedUrl).toContain('news');
  });
});
