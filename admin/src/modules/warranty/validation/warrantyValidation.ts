import { z } from 'zod';

export const warrantyFormSchema = z.object({
  saleId: z.string().min(1, 'Sale is required'),
  saleItemId: z.string().min(1, 'Sale item is required'),
  warrantyMonths: z
    .number({ invalid_type_error: 'Warranty months is required' })
    .int('Warranty months must be a whole number')
    .min(1, 'Warranty must be at least 1 month'),
});

export type WarrantyFormValues = z.infer<typeof warrantyFormSchema>;

export const WARRANTY_FORM_DEFAULT_VALUES: WarrantyFormValues = {
  saleId: '',
  saleItemId: '',
  warrantyMonths: 12,
};
