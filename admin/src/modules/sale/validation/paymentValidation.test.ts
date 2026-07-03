import { describe, expect, it } from 'vitest';

import { PAYMENT_MODES } from '@/common/constants/paymentMode';
import {
  finalizeSaleFormSchema,
  paymentFormSchema,
} from '@/modules/sale/validation/paymentValidation';

describe('paymentFormSchema', () => {
  it('accepts a valid cash payment', () => {
    const result = paymentFormSchema.safeParse({
      paymentMode: PAYMENT_MODES.CASH,
      amount: 1000,
      transactionNumber: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects zero or negative amounts', () => {
    const result = paymentFormSchema.safeParse({
      paymentMode: PAYMENT_MODES.UPI,
      amount: 0,
    });

    expect(result.success).toBe(false);
  });

  it('rejects transaction numbers longer than 150 characters', () => {
    const result = paymentFormSchema.safeParse({
      paymentMode: PAYMENT_MODES.CARD,
      amount: 500,
      transactionNumber: 'x'.repeat(151),
    });

    expect(result.success).toBe(false);
  });
});

describe('finalizeSaleFormSchema', () => {
  it('accepts finalize without initial payment when switch is off', () => {
    const result = finalizeSaleFormSchema.safeParse({
      recordInitialPayment: false,
      paymentMode: PAYMENT_MODES.CASH,
      amount: 30_000,
      transactionNumber: '',
    });

    expect(result.success).toBe(true);
  });

  it('requires a positive amount when recording initial payment', () => {
    const result = finalizeSaleFormSchema.safeParse({
      recordInitialPayment: true,
      paymentMode: PAYMENT_MODES.CASH,
      amount: 0,
    });

    expect(result.success).toBe(false);
  });
});
