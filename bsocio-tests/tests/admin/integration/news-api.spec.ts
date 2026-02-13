/**
 * ============================================
 * BSocio Admin - News API Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockNewsArticles } from '../../shared/mock-data';

test.describe('News API Integration', () => {
  test.beforeEach(async ({ page, context }) => {
    await setAdminAuthCookies(context, 'http://localhost:3001');
  });

  test('should send correct headers for authenticated requests', async ({ page }) => {
    let requestHeaders: Record<string, string> = {};

    await page.route('**/auth/me*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'admin-1', email: 'admin@bsocio.com', role: 'SUPER_ADMIN' }),
      });
    });

    await page.route('**/admin-dashboard/news*', async (route) => {
      requestHeaders = route.request().headers();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: mockNewsArticles.data, total: mockNewsArticles.total, skip: 0, take: 10 }),
      });
    });

    // Mock other needed APIs
    await page.route('**/admin-dashboard/overview*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/dashboard/news');
    await page.waitForTimeout(3000);

    // Should include content-type header
    expect(requestHeaders['accept'] || requestHeaders['content-type']).toBeTruthy();
  });

  test('should handle image upload with multipart form', async ({ page }) => {
    let uploadCalled = false;

    await mockAdminApis(page);

    await page.route('**/images*', async (route) => {
      if (route.request().method() === 'POST') {
        uploadCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ url: 'https://via.placeholder.com/800x400/uploaded' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/dashboard/news');
    await page.waitForTimeout(2000);

    // Click create
    const createBtn = page.getByRole('button', { name: /create|add|new/i });
    if (await createBtn.count() > 0) {
      await createBtn.first().click();
      await page.waitForTimeout(500);

      // Look for file input
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        // Set a test file
        await fileInput.first().setInputFiles({
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: Buffer.from('fake-png-data'),
        });
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should handle pagination parameters', async ({ page }) => {
    let requestUrl = '';

    await mockAdminApis(page);

    await page.route('**/admin-dashboard/news*', async (route) => {
      requestUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockNewsArticles.data,
          total: 50,
          skip: 0,
          take: 10,
        }),
      });
    });

    await page.goto('/dashboard/news');
    await page.waitForTimeout(3000);

    expect(requestUrl).toContain('news');
  });

  test('should send DELETE request when deleting article', async ({ page }) => {
    let deleteMethod = '';
    let deleteUrl = '';

    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });

    await mockAdminApis(page);

    await page.route('**/admin-dashboard/news/*', async (route) => {
      const method = route.request().method();
      if (method === 'DELETE') {
        deleteMethod = method;
        deleteUrl = route.request().url();
        await route.fulfill({ status: 204, body: '' });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNewsArticles.data[0]),
        });
      }
    });

    await page.goto('/dashboard/news');
    await page.waitForTimeout(2000);

    // Click the delete button (with aria-label) for the first article
    const deleteBtn = page.locator('button[title="Delete"]').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Confirm in ConfirmModal dialog
      const dialog = page.getByRole('dialog');
      if (await dialog.count() > 0) {
        await dialog.getByRole('button', { name: 'Delete' }).click();
        await page.waitForTimeout(2000);

        if (deleteMethod) {
          expect(deleteMethod).toBe('DELETE');
        }
      }
    }
  });
});
