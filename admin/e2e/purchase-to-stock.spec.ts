import { expect, test, type Page } from '@playwright/test';

import {
  buildPage,
  buildPurchaseItemResponse,
  buildPurchaseResponse,
  buildStockResponse,
  buildStockMovementResponse,
  envelopeJson,
  TEST_IMEI,
  TEST_PURCHASE_ID,
  TEST_SUPPLIER_ID,
} from '../src/test/fixtures/purchaseStockFixtures';
import { loginAsAdmin } from './helpers/auth';

async function mockPurchaseDetailApis(page: Page, received: boolean): Promise<void> {
  const purchase = buildPurchaseResponse();
  const item = buildPurchaseItemResponse();
  const stock = received ? [buildStockResponse()] : [];
  const movements = received ? [buildStockMovementResponse()] : [];

  await page.route(`**/api/v1/purchases/${TEST_PURCHASE_ID}`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(purchase, `/api/v1/purchases/${TEST_PURCHASE_ID}`),
      });
      return;
    }
    await route.continue();
  });

  await page.route(`**/api/v1/purchases/${TEST_PURCHASE_ID}/items`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson([item], `/api/v1/purchases/${TEST_PURCHASE_ID}/items`),
    });
  });

  await page.route('**/api/v1/suppliers/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(
        {
          id: TEST_SUPPLIER_ID,
          name: 'Test Supplier',
          mobile: '9876543210',
          email: null,
          gstNumber: null,
          address: null,
        },
        `/api/v1/suppliers/${TEST_SUPPLIER_ID}`
      ),
    });
  });

  await page.route('**/api/v1/product-variants**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage([]), '/api/v1/product-variants'),
    });
  });

  await page.route('**/api/v1/stock-movements**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage(movements), '/api/v1/stock-movements'),
    });
  });

  await page.route('**/api/v1/stock**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage(stock), '/api/v1/stock'),
    });
  });
}

test.describe('Purchase to Stock', () => {
  test('receives a purchase and shows stock on the inventory list', async ({ page }) => {
    let received = false;

    await mockPurchaseDetailApis(page, false);

    await page.route(`**/api/v1/purchases/${TEST_PURCHASE_ID}/receive`, async (route) => {
      received = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(
          buildPurchaseResponse(),
          `/api/v1/purchases/${TEST_PURCHASE_ID}/receive`
        ),
      });
    });

    await loginAsAdmin(page);

    await page.goto(`/purchases/${TEST_PURCHASE_ID}`);
    await expect(page.getByRole('heading', { name: 'INV-2026-001' })).toBeVisible();

    await page.getByRole('button', { name: 'Receive' }).click();
    await page.getByLabel('IMEI 1 (optional)').fill(TEST_IMEI);
    await page.getByRole('button', { name: 'Receive & Create Stock' }).click();

    await expect.poll(() => received).toBe(true);

    await mockPurchaseDetailApis(page, true);
    await page.goto('/stock');
    await expect(page.getByRole('heading', { name: 'Stock' })).toBeVisible();
    await expect(page.getByText(TEST_IMEI)).toBeVisible();
  });
});
