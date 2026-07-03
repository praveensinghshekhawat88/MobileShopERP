import { z } from 'zod';

import { PAYMENT_STATUSES } from '@/common/constants/paymentStatus';

const paymentStatusValues = [
  PAYMENT_STATUSES.PENDING,
  PAYMENT_STATUSES.PARTIAL,
  PAYMENT_STATUSES.PAID,
  PAYMENT_STATUSES.REFUNDED,
  PAYMENT_STATUSES.CANCELLED,
] as const;

/**
 * Mirrors `CreatePurchaseRequest`/`UpdatePurchaseRequest`. `totalAmount` is
 * required on create but recalculated from line items server-side.
 */
export const purchaseFormSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  invoiceNumber: z
    .string()
    .trim()
    .min(1, 'Invoice number is required')
    .max(100, 'Invoice number must be at most 100 characters'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  totalAmount: z
    .number({ invalid_type_error: 'Total amount is required' })
    .min(0, 'Total amount cannot be negative'),
  paymentStatus: z.enum(paymentStatusValues, {
    required_error: 'Payment status is required',
    invalid_type_error: 'Payment status is required',
  }),
});

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

export const PURCHASE_FORM_DEFAULT_VALUES: PurchaseFormValues = {
  supplierId: '',
  invoiceNumber: '',
  invoiceDate: '',
  totalAmount: 0,
  paymentStatus: PAYMENT_STATUSES.PENDING,
};
