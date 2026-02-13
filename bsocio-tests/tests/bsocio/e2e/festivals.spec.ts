/**
 * ============================================
 * BSocio Landing Page - Festivals Page E2E Tests
 * ============================================
 * The festivals page uses tabs (Awards, Events, Special Guests)
 * and modals for detail views. Separate detail pages also exist.
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';
import {
  mockAwardCategories,
  mockNominees,
  mockEvents,
  mockSpecialGuests,
} from '../../shared/mock-data';

test.describe('Festivals Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/festivals');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the festivals page', async ({ page }) => {
    await expect(page).toHaveURL(/\/festivals/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /festival/i }).first();
    await expect(heading).toBeVisible();
  });

  test('should display tab navigation', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Awards' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Events' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Special Guests' })).toBeVisible();
  });

  test('should display award categories on Awards tab (default)', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const category of mockAwardCategories.data) {
      const categoryEl = page.getByText(category.name);
      await expect(categoryEl.first()).toBeVisible();
    }
  });

  test('should display nominees on Awards tab', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const nominee of mockNominees.data) {
      const nomineeEl = page.getByText(nominee.name);
      await expect(nomineeEl.first()).toBeVisible();
    }
  });

  test('should switch to Events tab and display events', async ({ page }) => {
    // Click Events tab
    await page.getByRole('button', { name: 'Events' }).click();
    await page.waitForTimeout(1500);

    for (const event of mockEvents.data) {
      const eventEl = page.getByText(event.title);
      await expect(eventEl.first()).toBeVisible();
    }
  });

  test('should switch to Special Guests tab and display guests', async ({ page }) => {
    // Click Special Guests tab
    await page.getByRole('button', { name: 'Special Guests' }).click();
    await page.waitForTimeout(1500);

    for (const guest of mockSpecialGuests.data) {
      const guestEl = page.getByText(guest.name);
      await expect(guestEl.first()).toBeVisible();
    }
  });

  test('should handle empty categories gracefully', async ({ page }) => {
    await page.route('**/admin-dashboard/awards/categories*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
      });
    });

    await page.goto('/festivals');
    await page.waitForTimeout(1500);
    // Should not crash
    await expect(page).toHaveURL(/\/festivals/);
  });
});

test.describe('Event Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('should display event details', async ({ page }) => {
    await page.goto('/festivals/events/event-1');
    await page.waitForTimeout(2000);

    const title = page.getByText(mockEvents.data[0].title);
    await expect(title.first()).toBeVisible();
  });

  test('should show event location', async ({ page }) => {
    await page.goto('/festivals/events/event-1');
    await page.waitForTimeout(2000);

    const location = page.getByText(mockEvents.data[0].venue);
    await expect(location.first()).toBeVisible();
  });

  test('should handle non-existent event', async ({ page }) => {
    await page.route('**/admin-dashboard/events/nonexistent*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Event not found' }),
      });
    });

    await page.goto('/festivals/events/nonexistent');
    await page.waitForTimeout(1500);
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});

test.describe('Nominee Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('should display nominee details', async ({ page }) => {
    await page.goto('/festivals/nominees/nom-1');
    await page.waitForTimeout(2000);

    const name = page.getByText(mockNominees.data[0].name);
    await expect(name.first()).toBeVisible();
  });

  test('should display nominee bio', async ({ page }) => {
    await page.goto('/festivals/nominees/nom-1');
    await page.waitForTimeout(2000);

    const bio = page.getByText(mockNominees.data[0].about);
    await expect(bio.first()).toBeVisible();
  });
});

test.describe('Guest Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('should display guest details', async ({ page }) => {
    await page.goto('/festivals/guests/guest-1');
    await page.waitForTimeout(2000);

    const name = page.getByText(mockSpecialGuests.data[0].name);
    await expect(name.first()).toBeVisible();
  });
});
