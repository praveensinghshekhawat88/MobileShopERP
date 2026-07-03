import { expect, type Page } from '@playwright/test';

import { buildAuthTokensResponse, buildSuccessEnvelope } from '../../src/test/fixtures/authFixtures';

export async function mockAuthApis(page: Page): Promise<void> {
  const tokens = buildAuthTokensResponse();

  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSuccessEnvelope(tokens, '/api/v1/auth/login')),
    });
  });

  await page.route('**/api/v1/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSuccessEnvelope(tokens, '/api/v1/auth/refresh')),
    });
  });
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await mockAuthApis(page);

  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Mobile Number' }).fill('9999999999');
  await page.locator('input[name="password"]').fill('Admin@123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
