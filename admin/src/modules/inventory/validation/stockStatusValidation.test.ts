import { describe, expect, it } from 'vitest';

import { STOCK_STATUSES } from '@/common/constants/stockStatus';
import { stockStatusFormSchema } from '@/modules/inventory/validation/stockStatusValidation';

describe('stockStatusFormSchema', () => {
  it('accepts a valid status transition payload', () => {
    const result = stockStatusFormSchema.safeParse({
      newStatus: STOCK_STATUSES.RESERVED,
      reason: 'Customer hold',
    });

    expect(result.success).toBe(true);
  });

  it('accepts an empty optional reason', () => {
    const result = stockStatusFormSchema.safeParse({
      newStatus: STOCK_STATUSES.SOLD,
      reason: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing new status', () => {
    const result = stockStatusFormSchema.safeParse({
      reason: 'Invalid',
    });

    expect(result.success).toBe(false);
  });
});
