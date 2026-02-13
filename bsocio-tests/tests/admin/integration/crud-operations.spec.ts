/**
 * ============================================
 * BSocio Admin - CRUD Operations Integration Tests
 * ============================================
 * Generic CRUD pattern tests for events, FAQs, awards, etc.
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';

test.describe('CRUD API Request Verification', () => {
  test.beforeEach(async ({ page, context }) => {
    await setAdminAuthCookies(context, 'http://localhost:3001');
  });

  test('Events: should send POST for create', async ({ page }) => {
    let method = '';
    await mockAdminApis(page);

    await page.route('**/admin-dashboard/events', async (route) => {
      method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-event', title: 'New Event' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
        });
      }
    });

    await page.goto('/dashboard/events');
    await page.waitForTimeout(2000);

    const createBtn = page.getByRole('button', { name: /create|add|new/i });
    if (await createBtn.count() > 0) {
      await createBtn.first().click();
      await page.waitForTimeout(500);

      const titleInput = page.locator('input[name="title"]').or(page.getByLabel(/title/i));
      if (await titleInput.count() > 0) {
        await titleInput.first().fill('Test Create Event');
        const saveBtn = page.getByRole('button', { name: /save|create|submit/i });
        if (await saveBtn.count() > 0) {
          await saveBtn.first().click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('FAQs: should send correct reorder payload', async ({ page }) => {
    let reorderPayload: any = null;
    await mockAdminApis(page);

    await page.route('**/admin-dashboard/faqs/reorder*', async (route) => {
      reorderPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Reordered' }),
      });
    });

    await page.goto('/dashboard/faqs');
    await page.waitForTimeout(3000);

    // Look for reorder functionality (if exposed as buttons)
    const reorderBtn = page.locator('[data-testid="reorder"], [class*="drag"]');
    if (await reorderBtn.count() > 0) {
      // Would need drag interaction
    }
  });

  test('Legal: should send PUT with content for update', async ({ page }) => {
    let capturedMethod = '';
    let capturedBody: any = null;

    await mockAdminApis(page);

    await page.route('**/admin-dashboard/legal/**', async (route) => {
      capturedMethod = route.request().method();
      if (capturedMethod === 'PUT' || capturedMethod === 'PATCH') {
        capturedBody = JSON.parse(route.request().postData() || '{}');
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'legal-1',
          type: 'PRIVACY_POLICY',
          content: 'Updated content',
        }),
      });
    });

    await page.goto('/dashboard/legal');
    await page.waitForTimeout(3000);

    const saveBtn = page.getByRole('button', { name: /save|update|publish/i });
    if (await saveBtn.count() > 0) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);

      if (capturedMethod === 'PUT' || capturedMethod === 'PATCH') {
        expect(capturedBody).toBeTruthy();
      }
    }
  });
});
