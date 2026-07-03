import { expect, test } from '@playwright/test';

import { loginAsAdmin } from './helpers/auth';

test.describe('Authentication', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs in and reaches the dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByText('Welcome, Admin')).toBeVisible();
  });
});
