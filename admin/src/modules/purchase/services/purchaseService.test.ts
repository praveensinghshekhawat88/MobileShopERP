import { describe, expect, it } from 'vitest';

import { stockMovementService } from '@/modules/inventory/services/stockMovementService';
import { stockService } from '@/modules/inventory/services/stockService';
import { purchaseService } from '@/modules/purchase/services/purchaseService';
import {
  TEST_IMEI,
  TEST_PURCHASE_ID,
  TEST_PURCHASE_ITEM_ID,
} from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';

describe('purchaseService receive flow', () => {
  it('receives a purchase and creates stock via the API contract', async () => {
    const received = await purchaseService.receive(TEST_PURCHASE_ID, {
      lines: [{ purchaseItemId: TEST_PURCHASE_ITEM_ID, imeis: [TEST_IMEI] }],
    });

    expect(received.id).toBe(TEST_PURCHASE_ID);

    const state = getPurchaseStockMockState();
    expect(state.received).toBe(true);
    expect(state.stock).toHaveLength(1);
    expect(state.stock[0]?.imei).toBe(TEST_IMEI);

    const stockPage = await stockService.list({ page: 0, size: 20 });
    expect(stockPage.content).toHaveLength(1);

    const movements = await stockMovementService.list({
      page: 0,
      size: 1,
      referenceType: 'PURCHASE',
      referenceId: TEST_PURCHASE_ID,
    });
    expect(movements.totalElements).toBe(1);
  });
});

describe('purchaseService', () => {
  it('loads purchase detail by id', async () => {
    const purchase = await purchaseService.getById(TEST_PURCHASE_ID);
    expect(purchase.invoiceNumber).toBe('INV-2026-001');
  });
});
