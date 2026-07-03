import { describe, expect, it } from 'vitest';

import { warrantyFormSchema } from '@/modules/warranty/validation/warrantyValidation';
import { TEST_SALE_ID, TEST_SALE_ITEM_ID } from '@/test/fixtures/salePaymentWarrantyFixtures';

describe('warrantyFormSchema', () => {
  it('accepts a valid warranty registration', () => {
    const result = warrantyFormSchema.safeParse({
      saleId: TEST_SALE_ID,
      saleItemId: TEST_SALE_ITEM_ID,
      warrantyMonths: 12,
    });

    expect(result.success).toBe(true);
  });

  it('rejects warranty shorter than one month', () => {
    const result = warrantyFormSchema.safeParse({
      saleId: TEST_SALE_ID,
      saleItemId: TEST_SALE_ITEM_ID,
      warrantyMonths: 0,
    });

    expect(result.success).toBe(false);
  });

  it('requires both sale and sale item', () => {
    const result = warrantyFormSchema.safeParse({
      saleId: '',
      saleItemId: '',
      warrantyMonths: 12,
    });

    expect(result.success).toBe(false);
  });
});
