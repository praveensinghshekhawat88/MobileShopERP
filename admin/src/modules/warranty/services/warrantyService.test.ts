import { describe, expect, it } from 'vitest';

import { warrantyService } from '@/modules/warranty/services/warrantyService';
import { TEST_SALE_ITEM_ID } from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';

describe('warrantyService', () => {
  it('creates a warranty for a sold item', async () => {
    const warranty = await warrantyService.create({
      saleItemId: TEST_SALE_ITEM_ID,
      warrantyMonths: 12,
    });

    expect(warranty.saleItemId).toBe(TEST_SALE_ITEM_ID);
    expect(getSalePaymentWarrantyMockState().warranties).toHaveLength(1);
  });

  it('lists warranties from the API contract', async () => {
    await warrantyService.create({
      saleItemId: TEST_SALE_ITEM_ID,
      warrantyMonths: 6,
    });

    const page = await warrantyService.list({ page: 0, size: 20 });
    expect(page.content).toHaveLength(1);
    expect(page.content[0]?.warrantyMonths).toBe(6);
  });
});
