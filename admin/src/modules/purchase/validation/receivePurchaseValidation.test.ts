import { describe, expect, it } from 'vitest';

import { receivePurchaseFormSchema } from '@/modules/purchase/validation/receivePurchaseValidation';
import { TEST_IMEI, TEST_PURCHASE_ITEM_ID } from '@/test/fixtures/purchaseStockFixtures';

describe('receivePurchaseFormSchema', () => {
  it('accepts one IMEI per unit when all fields are filled', () => {
    const result = receivePurchaseFormSchema.safeParse({
      lines: [
        {
          purchaseItemId: TEST_PURCHASE_ITEM_ID,
          variantLabel: 'SKU-001',
          quantity: 1,
          imeis: [TEST_IMEI],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts blank IMEIs for accessory lines', () => {
    const result = receivePurchaseFormSchema.safeParse({
      lines: [
        {
          purchaseItemId: TEST_PURCHASE_ITEM_ID,
          variantLabel: 'Case',
          quantity: 2,
          imeis: ['', ''],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects partial IMEI entry for a serialized line', () => {
    const result = receivePurchaseFormSchema.safeParse({
      lines: [
        {
          purchaseItemId: TEST_PURCHASE_ITEM_ID,
          variantLabel: 'Phone',
          quantity: 2,
          imeis: [TEST_IMEI, ''],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid IMEI format', () => {
    const result = receivePurchaseFormSchema.safeParse({
      lines: [
        {
          purchaseItemId: TEST_PURCHASE_ITEM_ID,
          variantLabel: 'Phone',
          quantity: 1,
          imeis: ['12345'],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
