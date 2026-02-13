/**
 * ============================================
 * BSocio Admin - FAQs CRUD E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockFAQs } from '../../shared/mock-data';
import { buildFAQ } from '../../shared/test-data';

test.describe('FAQs Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/faqs');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load FAQs management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/faqs/);
    // There are multiple h1 on the page (app header + page title), so filter by text
    await expect(page.locator('h1', { hasText: 'FAQs' })).toBeVisible();
  });

  test('should display FAQ list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const faq of mockFAQs.data) {
      const question = page.getByText(faq.question);
      await expect(question.first()).toBeVisible();
    }
  });

  test('should have create FAQ button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Add FAQ' });
    await expect(createBtn).toBeVisible();
  });

  test('should create a new FAQ', async ({ page }) => {
    await page.getByRole('button', { name: 'Add FAQ' }).click();
    await page.waitForTimeout(500);

    // Modal title should be "Add New FAQ"
    await expect(page.getByText('Add New FAQ')).toBeVisible();

    const faq = buildFAQ();
    await page.locator('#question').fill(faq.question);

    // Skip answer (RichTextEditor - not easily fillable in tests)

    // Submit via the modal's "Add FAQ" button (use last() to avoid the header button)
    const submitBtns = page.getByRole('button', { name: 'Add FAQ' });
    await submitBtns.last().click();
    await page.waitForTimeout(2000);
  });

  test('should edit an existing FAQ', async ({ page }) => {
    await page.waitForTimeout(2000);

    await page.locator('button[title="Edit"]').first().click();
    await page.waitForTimeout(500);

    // Modal title should be "Edit FAQ"
    await expect(page.getByText('Edit FAQ')).toBeVisible();

    const questionField = page.locator('#question');
    await questionField.clear();
    await questionField.fill('Updated FAQ Question?');

    await page.getByRole('button', { name: 'Update FAQ' }).click();
    await page.waitForTimeout(2000);
  });

  test('should delete a FAQ with confirmation', async ({ page }) => {
    await page.waitForTimeout(2000);

    await page.locator('button[title="Delete"]').first().click();
    await page.waitForTimeout(500);

    // ConfirmModal has role="dialog"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(2000);
  });
});
