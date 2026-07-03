import { z } from 'zod';

import { PAYMENT_STATUSES } from '@/common/constants/paymentStatus';

const writablePaymentStatuses = [
  PAYMENT_STATUSES.PENDING,
  PAYMENT_STATUSES.PARTIAL,
  PAYMENT_STATUSES.PAID,
] as const;

/** Mirrors `CreateSaleRequest`/`UpdateSaleRequest`. */
export const saleFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  invoiceNumber: z.string().trim().max(100, 'Invoice number must be at most 100 characters').optional(),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  totalAmount: z.number({ invalid_type_error: 'Total amount is required' }).min(0, 'Total amount cannot be negative'),
  paymentStatus: z.enum(writablePaymentStatuses, {
    required_error: 'Payment status is required',
    invalid_type_error: 'Payment status is required',
  }),
});

export type SaleFormValues = z.infer<typeof saleFormSchema>;

export const SALE_FORM_DEFAULT_VALUES: SaleFormValues = {
  customerId: '',
  invoiceNumber: '',
  invoiceDate: '',
  totalAmount: 0,
  paymentStatus: PAYMENT_STATUSES.PENDING,
};
