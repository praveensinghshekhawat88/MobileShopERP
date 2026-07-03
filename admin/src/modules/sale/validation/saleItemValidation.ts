import { z } from 'zod';

/** Mirrors `CreateSaleItemRequest`/`UpdateSaleItemRequest`. */
export const saleItemFormSchema = z
  .object({
    stockId: z.string().min(1, 'Stock item is required'),
    sellingPrice: z
      .number({ invalid_type_error: 'Selling price is required' })
      .positive('Selling price must be greater than 0'),
    discount: z
      .number({ invalid_type_error: 'Discount is required' })
      .min(0, 'Discount cannot be negative'),
    taxAmount: z.number({ invalid_type_error: 'Tax amount is required' }).min(0, 'Tax amount cannot be negative'),
  })
  .refine((values) => values.discount <= values.sellingPrice, {
    message: 'Discount cannot exceed selling price',
    path: ['discount'],
  });

export type SaleItemFormValues = z.infer<typeof saleItemFormSchema>;

export const SALE_ITEM_FORM_DEFAULT_VALUES: SaleItemFormValues = {
  stockId: '',
  sellingPrice: 0,
  discount: 0,
  taxAmount: 0,
};
