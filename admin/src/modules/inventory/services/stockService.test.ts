import { describe, expect, it } from 'vitest';

import { STOCK_STATUSES } from '@/common/constants/stockStatus';
import { stockService } from '@/modules/inventory/services/stockService';
import {
  TEST_IMEI,
  TEST_STOCK_ID,
} from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';

describe('stockService', () => {
  it('loads stock detail by id', async () => {
    const stock = await stockService.getById(TEST_STOCK_ID);

    expect(stock.id).toBe(TEST_STOCK_ID);
    expect(stock.imei).toBe(TEST_IMEI);
    expect(stock.stockStatus).toBe(STOCK_STATUSES.AVAILABLE);
  });
});

describe('stockService status transition', () => {
  it('updates stock status via the dedicated endpoint', async () => {
    const updated = await stockService.updateStatus(TEST_STOCK_ID, {
      newStatus: STOCK_STATUSES.RESERVED,
      reason: 'Reserved for walk-in customer',
    });

    expect(updated.stockStatus).toBe(STOCK_STATUSES.RESERVED);

    const state = getPurchaseStockMockState();
    expect(state.stock[0]?.stockStatus).toBe(STOCK_STATUSES.RESERVED);
    expect(state.movements.some((movement) => movement.movementType === 'ADJUSTMENT')).toBe(true);
  });
});
