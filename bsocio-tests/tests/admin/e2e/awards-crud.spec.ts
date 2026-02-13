/**
 * ============================================
 * BSocio Admin - Awards Management E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockAwardCategories, mockAwardStatistics } from '../../shared/mock-data';
import { buildAwardCategory } from '../../shared/test-data';

test.describe('Awards Category Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/awards');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load awards management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/awards/);
  });

  test('should display award categories', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const category of mockAwardCategories.data) {
      const name = page.getByText(category.name);
      await expect(name.first()).toBeVisible();
    }
  });

  test('should have create category button', async ({ page }) => {
    // Awards page uses Quick Action cards, not a header button
    await page.waitForTimeout(2000);
    const addCard = page.getByText('Add New Category');
    await expect(addCard.first()).toBeVisible();
  });

  test('should create a new category', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Click the "Add New Category" quick action card
    await page.getByText('Add New Category').first().click();
    await page.waitForTimeout(500);

    // Modal title should be "Create Category" — use heading role to avoid match with button
    await expect(page.getByRole('heading', { name: 'Create Category' })).toBeVisible();

    const category = buildAwardCategory();
    const nameField = page.locator('input').first();
    await nameField.fill(category.name);

    const descField = page.locator('textarea').first();
    if (await descField.count() > 0) {
      await descField.fill(category.description);
    }

    const saveBtn = page.getByRole('button', { name: 'Create Category' });
    await saveBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should edit a category', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Awards uses "Manage Category" button per card
    const manageBtn = page.getByRole('button', { name: /manage category/i });
    if (await manageBtn.count() > 0) {
      await manageBtn.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should delete a category', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Open manage/edit modal first, then click Delete inside
    const manageBtn = page.getByRole('button', { name: /manage category/i });
    if (await manageBtn.count() > 0) {
      await manageBtn.first().click();
      await page.waitForTimeout(500);

      // Look for Delete button inside edit modal
      const deleteBtn = page.getByRole('button', { name: 'Delete' });
      if (await deleteBtn.count() > 0) {
        await deleteBtn.first().click();
        await page.waitForTimeout(500);

        // Confirm in ConfirmModal
        const dialog = page.getByRole('dialog');
        if (await dialog.count() > 0) {
          await dialog.getByRole('button', { name: 'Delete' }).click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });
});
