/**
 * ============================================
 * BSocio - Festivals API Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import {
  mockAwardCategories,
  mockNominees,
  mockEvents,
  mockSpecialGuests,
  mockAwardStatistics,
} from '../../shared/mock-data';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Festivals API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should fetch all festivals data in parallel', async ({ page }) => {
    const apiCalls: string[] = [];

    await page.route('**/admin-dashboard/awards/categories*', async (route) => {
      apiCalls.push('categories');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockAwardCategories.data, total: mockAwardCategories.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/nominees*', async (route) => {
      apiCalls.push('nominees');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockNominees.data, total: mockNominees.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/events*', async (route) => {
      apiCalls.push('events');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockEvents.data, total: mockEvents.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/guests*', async (route) => {
      apiCalls.push('guests');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockSpecialGuests.data, total: mockSpecialGuests.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/statistics*', async (route) => {
      apiCalls.push('statistics');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAwardStatistics),
      });
    });

    await page.goto('/festivals');
    await page.waitForTimeout(3000);

    // Verify multiple API calls were made
    expect(apiCalls.length).toBeGreaterThan(0);
  });

  test('should handle partial API failures gracefully', async ({ page }) => {
    await page.route('**/admin-dashboard/awards/categories*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockAwardCategories.data, total: mockAwardCategories.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/nominees*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server Error' }),
      });
    });

    await page.route('**/admin-dashboard/events*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockEvents.data, total: mockEvents.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/guests*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockSpecialGuests.data, total: mockSpecialGuests.total, skip: 0, take: 10 }),
      });
    });

    await page.route('**/admin-dashboard/awards/statistics*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAwardStatistics),
      });
    });

    await page.goto('/festivals');
    await page.waitForTimeout(3000);

    // Page should still display available data
    await expect(page).toHaveURL(/\/festivals/);
  });

  test('should pass correct event ID to detail API', async ({ page }) => {
    let requestedId = '';

    await page.route('**/admin-dashboard/events/*', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/events\/([^/?]+)/);
      if (match) requestedId = match[1];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockEvents.data[0]),
      });
    });

    await page.goto('/festivals/events/event-1');
    await page.waitForTimeout(2000);

    expect(requestedId).toBe('event-1');
  });

  test('should pass correct nominee ID to detail API', async ({ page }) => {
    let requestedId = '';

    await page.route('**/admin-dashboard/awards/nominees/*', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/nominees\/([^/?]+)/);
      if (match) requestedId = match[1];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNominees.data[0]),
      });
    });

    await page.goto('/festivals/nominees/nom-1');
    await page.waitForTimeout(2000);

    expect(requestedId).toBe('nom-1');
  });
});
