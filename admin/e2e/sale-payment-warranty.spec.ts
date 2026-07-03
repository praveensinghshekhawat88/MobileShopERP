import { expect, test, type Page } from '@playwright/test';

import { loginAsAdmin } from './helpers/auth';
import {
  buildPage,
  buildSaleItemResponse,
  buildSaleMovementResponse,
  buildSaleResponse,
  buildWarrantyResponse,
  computePaymentBalance,
  envelopeJson,
  TEST_CUSTOMER_ID,
  TEST_PAYMENT_AMOUNT,
  TEST_SALE_ID,
  TEST_SALE_ITEM_ID,
  TEST_SALE_TOTAL,
} from '../src/test/fixtures/salePaymentWarrantyFixtures';

interface SaleFlowTrackers {
  readonly onFinalize?: () => void;
  readonly onPayment?: () => void;
  readonly onWarranty?: () => void;
}

async function mockSaleFlowApis(
  page: Page,
  state: { finalized: boolean; paid: boolean; warrantyCount: number },
  trackers: SaleFlowTrackers = {}
): Promise<void> {
  const sale = buildSaleResponse({
    paymentStatus: state.paid ? 'PAID' : 'PENDING',
  });
  const saleItem = buildSaleItemResponse();
  const movements = state.finalized ? [buildSaleMovementResponse()] : [];
  const payments = state.paid
    ? [
        {
          id: 'pay-1',
          referenceType: 'SALE' as const,
          referenceId: TEST_SALE_ID,
          paymentMode: 'CASH' as const,
          amount: TEST_PAYMENT_AMOUNT,
          transactionNumber: null,
          paymentDate: '2026-01-20T10:00:00.000Z',
        },
      ]
    : [];
  const warranties = Array.from({ length: state.warrantyCount }, (_, index) =>
    buildWarrantyResponse({ id: `warranty-${index + 1}` })
  );
  const balance = computePaymentBalance({ ...sale, totalAmount: TEST_SALE_TOTAL }, payments);

  await page.route(`**/api/v1/sales/${TEST_SALE_ID}`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(
          { ...sale, paymentStatus: balance.paymentStatus },
          `/api/v1/sales/${TEST_SALE_ID}`
        ),
      });
      return;
    }
    await route.fallback();
  });

  await page.route(`**/api/v1/sales/${TEST_SALE_ID}/items`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson([saleItem], `/api/v1/sales/${TEST_SALE_ID}/items`),
    });
  });

  await page.route(`**/api/v1/sales/${TEST_SALE_ID}/finalize`, async (route) => {
    trackers.onFinalize?.();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(
        {
          saleId: TEST_SALE_ID,
          invoiceNumber: 'SAL-2026-001',
          invoiceDate: '2026-01-20',
          customerId: TEST_CUSTOMER_ID,
          totalAmount: TEST_SALE_TOTAL,
          paymentStatus: 'PENDING',
          amountPaid: 0,
          balanceDue: TEST_SALE_TOTAL,
          itemCount: 1,
        },
        `/api/v1/sales/${TEST_SALE_ID}/finalize`
      ),
    });
  });

  await page.route(
    (url) => new URL(url).pathname === '/api/v1/sales',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(buildPage([sale]), '/api/v1/sales'),
      });
    }
  );

  await page.route('**/api/v1/customers/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(
        {
          id: TEST_CUSTOMER_ID,
          name: 'Test Customer',
          mobile: '9876543210',
          email: null,
          gstNumber: null,
          address: null,
        },
        `/api/v1/customers/${TEST_CUSTOMER_ID}`
      ),
    });
  });

  await page.route('**/api/v1/stock-movements**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(buildPage(movements), '/api/v1/stock-movements'),
    });
  });

  await page.route(
    (url) => new URL(url).pathname === '/api/v1/stock',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelopeJson(buildPage([]), '/api/v1/stock'),
      });
    }
  );

  await page.route('**/api/v1/payments/balance**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: envelopeJson(balance, '/api/v1/payments/balance'),
    });
  });

  await page.route(
    (url) => new URL(url).pathname === '/api/v1/payments',
    async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelopeJson(payments, '/api/v1/payments'),
        });
        return;
      }

      if (route.request().method() === 'POST') {
        trackers.onPayment?.();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelopeJson(
            {
              id: 'pay-1',
              referenceType: 'SALE',
              referenceId: TEST_SALE_ID,
              paymentMode: 'CASH',
              amount: TEST_PAYMENT_AMOUNT,
              transactionNumber: null,
              paymentDate: '2026-01-20T10:00:00.000Z',
            },
            '/api/v1/payments'
          ),
        });
      }
    }
  );

  await page.route(
    (url) => new URL(url).pathname === '/api/v1/warranties',
    async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelopeJson(buildPage(warranties), '/api/v1/warranties'),
        });
        return;
      }

      if (route.request().method() === 'POST') {
        trackers.onWarranty?.();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelopeJson(buildWarrantyResponse(), '/api/v1/warranties'),
        });
      }
    }
  );
}

test.describe('Sale Payment Warranty', () => {
  test('finalizes a sale, records payment, and registers warranty', async ({ page }) => {
    let finalized = false;
    let paid = false;
    let warrantyCount = 0;

    const trackers: SaleFlowTrackers = {
      onFinalize: () => {
        finalized = true;
      },
      onPayment: () => {
        paid = true;
      },
      onWarranty: () => {
        warrantyCount += 1;
      },
    };

    await mockSaleFlowApis(page, { finalized: false, paid: false, warrantyCount: 0 }, trackers);

    await loginAsAdmin(page);

    await page.goto(`/sales/${TEST_SALE_ID}`);
    await expect(page.getByRole('heading', { name: 'SAL-2026-001' })).toBeVisible();

    await page.getByRole('button', { name: 'Finalize' }).click();
    await page.getByRole('button', { name: 'Finalize Sale' }).click();
    await expect.poll(() => finalized).toBe(true);

    await mockSaleFlowApis(page, { finalized: true, paid: false, warrantyCount: 0 }, trackers);
    await page.reload();
    await expect(page.getByText('Finalized')).toBeVisible();

    await page.getByRole('button', { name: 'Record Payment' }).click();
    await page.getByRole('dialog', { name: /Record Payment/i }).getByLabel('Amount').fill(String(TEST_PAYMENT_AMOUNT));
    await page.getByRole('dialog', { name: /Record Payment/i }).getByRole('button', { name: 'Record Payment' }).click();
    await expect.poll(() => paid).toBe(true);

    await mockSaleFlowApis(page, { finalized: true, paid: true, warrantyCount: 0 }, trackers);
    await page.goto('/warranties');
    await expect(page.getByRole('heading', { name: 'Warranties' })).toBeVisible();

    await page.getByRole('button', { name: 'New Warranty' }).click();
    await page.getByLabel('Sale Invoice').click();
    await page.getByRole('option', { name: 'SAL-2026-001' }).click();
    await page.getByLabel('Sale Item').click();
    await page.getByRole('option', { name: new RegExp(TEST_SALE_ITEM_ID.slice(0, 8), 'i') }).click();
    await page.getByRole('button', { name: 'Create Warranty' }).click();

    await expect.poll(() => warrantyCount).toBe(1);

    await mockSaleFlowApis(page, { finalized: true, paid: true, warrantyCount: 1 }, trackers);
    await page.reload();
    await expect(page.getByRole('cell', { name: '12' })).toBeVisible();
  });
});
