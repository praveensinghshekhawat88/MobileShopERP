import { z } from 'zod';

/** Mirrors `CreatePurchaseItemRequest`/`UpdatePurchaseItemRequest`. */
export const purchaseItemFormSchema = z.object({
  variantId: z.string().min(1, 'Variant is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  purchasePrice: z
    .number({ invalid_type_error: 'Purchase price is required' })
    .positive('Purchase price must be greater than 0'),
  taxAmount: z
    .number({ invalid_type_error: 'Tax amount is required' })
    .min(0, 'Tax amount cannot be negative'),
});

export type PurchaseItemFormValues = z.infer<typeof purchaseItemFormSchema>;

export const PURCHASE_ITEM_FORM_DEFAULT_VALUES: PurchaseItemFormValues = {
  variantId: '',
  quantity: 1,
  purchasePrice: 0,
  taxAmount: 0,
};
