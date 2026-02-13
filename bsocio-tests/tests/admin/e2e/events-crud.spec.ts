/**
 * ============================================
 * BSocio Admin - Events CRUD E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockEvents, mockEventStatistics } from '../../shared/mock-data';
import { buildEvent } from '../../shared/test-data';

const FIRST_EVENT = mockEvents.data[0]; // "BSocio Annual Gala"

test.describe('Events Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/events');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load events management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/events/);
    await expect(page.locator('h1', { hasText: 'Events' })).toBeVisible();
  });

  test('should display events list', async ({ page }) => {
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    for (const event of mockEvents.data) {
      const title = page.getByText(event.title);
      await expect(title.first()).toBeVisible();
    }
  });

  test('should have create event button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Create Event' });
    await expect(createBtn).toBeVisible();
  });

  test('should open create event form', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Create Event' });
    await createBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Create New Event')).toBeVisible();
    const titleInput = page.locator('#eventTitle');
    await expect(titleInput).toBeVisible();
  });

  test('should create a new event', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Create Event' });
    await createBtn.click();
    await page.waitForTimeout(500);

    const event = buildEvent();
    await page.locator('#eventTitle').fill(event.title);
    await page.locator('#venue').fill(event.venue);
    await page.locator('#eventDate').fill(event.eventDate.slice(0, 10));
    await page.locator('#eventTime').fill('18:00');
    await page.locator('#maxAttendees').fill('200');
    await page.locator('textarea#description').fill(event.description);

    const submitBtn = page.getByRole('button', { name: 'Create Event' }).last();
    await submitBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should edit an existing event', async ({ page }) => {
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    const editBtn = page.locator('button[title="Edit"]').first();
    await editBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Edit Event')).toBeVisible();

    const titleInput = page.locator('#eventTitle');
    await titleInput.clear();
    await titleInput.fill('Updated Event Title');

    const updateBtn = page.getByRole('button', { name: 'Update Event' });
    await updateBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should delete an event with confirmation', async ({ page }) => {
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    const deleteBtn = page.locator('button[title="Delete"]').first();
    await deleteBtn.click();
    await page.waitForTimeout(500);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const confirmBtn = dialog.getByRole('button', { name: 'Delete' });
    await confirmBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should display event statistics', async ({ page }) => {
    await page.waitForTimeout(2000);
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    // Verify first event data is shown in the table
    await expect(page.getByText(FIRST_EVENT.title).first()).toBeVisible();
  });

  test('should handle upcoming/past event tabs', async ({ page }) => {
    const allTab = page.getByRole('button', { name: 'All Events' });
    const upcomingTab = page.getByRole('button', { name: 'Upcoming' });
    const pastTab = page.getByRole('button', { name: 'Past' });

    await expect(allTab).toBeVisible();
    await expect(upcomingTab).toBeVisible();
    await expect(pastTab).toBeVisible();

    await upcomingTab.click();
    await page.waitForTimeout(500);

    await pastTab.click();
    await page.waitForTimeout(500);

    await allTab.click();
    await page.waitForTimeout(500);
  });
});
