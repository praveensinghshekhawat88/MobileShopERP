import { z } from 'zod';

import { PAYMENT_MODES } from '@/common/constants/paymentMode';

/** Mirrors `CreatePaymentRequest` for sale payments (`referenceType: SALE`). */
export const paymentFormSchema = z.object({
  paymentMode: z.enum(
    [
      PAYMENT_MODES.CASH,
      PAYMENT_MODES.UPI,
      PAYMENT_MODES.CARD,
      PAYMENT_MODES.BANK_TRANSFER,
      PAYMENT_MODES.FINANCE,
      PAYMENT_MODES.EMI,
    ],
    { required_error: 'Payment mode is required', invalid_type_error: 'Payment mode is required' }
  ),
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(0.01, 'Amount must be greater than 0'),
  transactionNumber: z.string().trim().max(150, 'Transaction number must be at most 150 characters').optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const PAYMENT_FORM_DEFAULT_VALUES: PaymentFormValues = {
  paymentMode: PAYMENT_MODES.CASH,
  amount: 0,
  transactionNumber: '',
};

/** Optional initial payment on finalize — mirrors `FinalizeSaleRequest.InitialPaymentRequest`. */
export const finalizeSaleFormSchema = z.object({
  recordInitialPayment: z.boolean(),
  paymentMode: z.enum(
    [
      PAYMENT_MODES.CASH,
      PAYMENT_MODES.UPI,
      PAYMENT_MODES.CARD,
      PAYMENT_MODES.BANK_TRANSFER,
      PAYMENT_MODES.FINANCE,
      PAYMENT_MODES.EMI,
    ],
    { invalid_type_error: 'Payment mode is required' }
  ),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  transactionNumber: z.string().trim().max(150).optional(),
});

export type FinalizeSaleFormValues = z.infer<typeof finalizeSaleFormSchema>;

export const FINALIZE_SALE_FORM_DEFAULT_VALUES: FinalizeSaleFormValues = {
  recordInitialPayment: false,
  paymentMode: PAYMENT_MODES.CASH,
  amount: 0,
  transactionNumber: '',
};
