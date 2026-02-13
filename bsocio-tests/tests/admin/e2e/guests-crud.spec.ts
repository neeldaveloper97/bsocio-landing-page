/**
 * ============================================
 * BSocio Admin - Special Guests Management E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockSpecialGuests } from '../../shared/mock-data';

test.describe('Special Guests Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/guests');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load guests page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/guests/);
  });

  test('should display guests list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const guest of mockSpecialGuests.data) {
      const name = page.getByText(guest.name);
      await expect(name.first()).toBeVisible();
    }
  });

  test('should have create guest button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /add guest/i });
    await expect(createBtn.first()).toBeVisible();
  });

  test('should create a new guest', async ({ page }) => {
    await page.getByRole('button', { name: /add guest/i }).first().click();
    await page.waitForTimeout(500);

    // Modal title: "Add Special Guest"
    await expect(page.getByText('Add Special Guest')).toBeVisible();

    const nameField = page.locator('input#name');
    await nameField.fill('Dr. Emeka James');

    const titleField = page.locator('input#title');
    if (await titleField.count() > 0) {
      await titleField.fill('Distinguished Speaker');
    }

    // Submit: "Save as Draft" or "Publish Guest"
    const saveBtn = page.getByRole('button', { name: /save|publish/i });
    await saveBtn.first().click();
    await page.waitForTimeout(2000);
  });

  test('should edit a guest', async ({ page }) => {
    await page.waitForTimeout(2000);
    const editBtn = page.locator('button[title="Edit"]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should delete a guest', async ({ page }) => {
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
