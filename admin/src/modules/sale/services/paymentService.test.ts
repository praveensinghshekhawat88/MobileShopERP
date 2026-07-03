import { describe, expect, it } from 'vitest';

import { PAYMENT_MODES } from '@/common/constants/paymentMode';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { paymentService } from '@/modules/sale/services/paymentService';
import {
  TEST_PAYMENT_AMOUNT,
  TEST_SALE_ID,
} from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';

describe('paymentService', () => {
  it('records a payment against a sale', async () => {
    const payment = await paymentService.create({
      referenceType: REFERENCE_TYPES.SALE,
      referenceId: TEST_SALE_ID,
      paymentMode: PAYMENT_MODES.CASH,
      amount: TEST_PAYMENT_AMOUNT,
    });

    expect(payment.referenceId).toBe(TEST_SALE_ID);
    expect(getSalePaymentWarrantyMockState().payments).toHaveLength(1);
  });

  it('loads payments by sale reference', async () => {
    await paymentService.create({
      referenceType: REFERENCE_TYPES.SALE,
      referenceId: TEST_SALE_ID,
      paymentMode: PAYMENT_MODES.UPI,
      amount: 5000,
    });

    const payments = await paymentService.listByReference(REFERENCE_TYPES.SALE, TEST_SALE_ID);
    expect(payments).toHaveLength(1);
    expect(payments[0]?.amount).toBe(5000);
  });
});
