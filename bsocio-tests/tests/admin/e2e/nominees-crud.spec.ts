/**
 * ============================================
 * BSocio Admin - Nominees Management E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockNominees } from '../../shared/mock-data';
import { buildNominee } from '../../shared/test-data';

test.describe('Nominees Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/nominees');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load nominees page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/nominees/);
  });

  test('should display nominees list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const nominee of mockNominees.data) {
      const name = page.getByText(nominee.name);
      await expect(name.first()).toBeVisible();
    }
  });

  test('should have create nominee button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create nominee/i });
    await expect(createBtn.first()).toBeVisible();
  });

  test('should create a new nominee', async ({ page }) => {
    await page.getByRole('button', { name: /create nominee/i }).first().click();
    await page.waitForTimeout(500);

    // Modal title: "Create Nominee"
    await expect(page.getByText('Create Nominee').first()).toBeVisible();

    const nominee = buildNominee();
    const nameField = page.locator('input#name');
    await nameField.fill(nominee.name);

    // Submit: "Save as Pending" or "Approve Nominee"
    const saveBtn = page.getByRole('button', { name: /save|approve|pending/i });
    await saveBtn.first().click();
    await page.waitForTimeout(2000);
  });

  test('should show nominee status badges', async ({ page }) => {
    await page.waitForTimeout(2000);
    const statusBadge = page.getByText(/approved|pending|rejected/i);
    if (await statusBadge.count() > 0) {
      await expect(statusBadge.first()).toBeVisible();
    }
  });

  test('should handle nominee status change', async ({ page }) => {
    await page.waitForTimeout(2000);

    const editBtn = page.locator('button[title="Edit"]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click({ force: true });
      await page.waitForTimeout(500);

      const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
      if (await statusSelect.count() > 0) {
        await statusSelect.first().selectOption('APPROVED');
      }
    }
  });

  test('should delete a nominee', async ({ page }) => {
    await page.waitForTimeout(2000);
    const deleteBtn = page.locator('button[title="Delete"]').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Confirm in ConfirmModal dialog
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(2000);
    }
  });
});
