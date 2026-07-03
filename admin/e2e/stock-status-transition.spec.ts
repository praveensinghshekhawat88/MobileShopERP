import { expect, test, type Page } from '@playwright/test';

import { loginAsAdmin } from './helpers/auth';
import {
  buildPage,
  buildStockMovementResponse,
  buildStockResponse,
  envelopeJson,
  TEST_STOCK_ID,
} from '../src/test/fixtures/purchaseStockFixtures';
import { STOCK_STATUSES } from '../src/common/constants/stockStatus';

async function mockStockDetailApis(
  page: Page,
  status: (typeof STOCK_STATUSES)[keyof typeof STOCK_STATUSES]
): Promise<void> {
  const stock = buildStockResponse({ stockStatus: status });
  const movements =
    status === STOCK_STATUSES.AVAILABLE
      ? []
      : [
          buildStockMovementResponse({
            movementType: 'ADJUSTMENT',
            remarks: 'Reserved for customer',
          }),
        ];

  await page.route(`**/api/v1/stock/${TEST_STOCK_ID}`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(stock, `/api/v1/stock/${TEST_STOCK_ID}`),
      });
      return;
    }
    await route.fallback();
  });

  await page.route(
    (url) => new URL(url).pathname === '/api/v1/stock',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(buildPage([stock]), '/api/v1/stock'),
      });
    }
  );

  await page.route('**/api/v1/stock-movements**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage(movements), '/api/v1/stock-movements'),
    });
  });

  await page.route('**/api/v1/product-variants**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage([]), '/api/v1/product-variants'),
    });
  });
}

test.describe('Stock status transition', () => {
  test('changes stock status from the detail page', async ({ page }) => {
    let statusUpdated = false;

    await mockStockDetailApis(page, STOCK_STATUSES.AVAILABLE);

    await page.route(`**/api/v1/stock/${TEST_STOCK_ID}/status`, async (route) => {
      statusUpdated = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(
          buildStockResponse({ stockStatus: STOCK_STATUSES.RESERVED }),
          `/api/v1/stock/${TEST_STOCK_ID}/status`
        ),
      });
    });

    await loginAsAdmin(page);

    await page.goto(`/stock/${TEST_STOCK_ID}`);
    await expect(page.getByRole('heading', { name: 'Stock Detail' })).toBeVisible();
    await expect(page.getByRole('main').getByText('Available', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Change Status' }).click();
    await page.getByRole('dialog', { name: /Change Stock Status/i }).getByLabel('Reason (optional)').fill('Reserved for customer');
    await page.getByRole('dialog', { name: /Change Stock Status/i }).getByRole('button', { name: 'Update Status' }).click();

    await expect.poll(() => statusUpdated).toBe(true);

    await mockStockDetailApis(page, STOCK_STATUSES.RESERVED);
    await page.reload();
    await expect(page.getByRole('main').getByText('Reserved', { exact: true })).toBeVisible();
  });
});
