import { describe, expect, it } from 'vitest';

import { saleService } from '@/modules/sale/services/saleService';
import { TEST_SALE_ID } from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';

describe('saleService', () => {
  it('loads sale detail by id', async () => {
    const sale = await saleService.getById(TEST_SALE_ID);
    expect(sale.invoiceNumber).toBe('SAL-2026-001');
  });
});

describe('saleService finalize flow', () => {
  it('finalizes a sale and records a SALE stock movement', async () => {
    const completion = await saleService.finalize(TEST_SALE_ID);

    expect(completion.saleId).toBe(TEST_SALE_ID);

    const state = getSalePaymentWarrantyMockState();
    expect(state.finalized).toBe(true);
    expect(state.movements).toHaveLength(1);
    expect(state.movements[0]?.movementType).toBe('SALE');
  });
});
