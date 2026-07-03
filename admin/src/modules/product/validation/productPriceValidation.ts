import { z } from 'zod';

import { PRICE_TYPES } from '@/common/constants/priceType';

/**
 * Mirrors `CreateProductPriceRequest`. `variantId` is supplied by page
 * context. `price` is `@NotNull @Positive`; dates are ISO `yyyy-MM-dd`
 * strings (see `FormDatePicker`). `effectiveTo >= effectiveFrom` is
 * re-validated server-side (see `ProductPriceService#validateDates`) —
 * mirrored here with `.refine` for immediate feedback.
 */
export const productPriceFormSchema = z
  .object({
    priceType: z.enum(
      [PRICE_TYPES.MRP, PRICE_TYPES.RETAIL, PRICE_TYPES.WHOLESALE, PRICE_TYPES.DEALER, PRICE_TYPES.OFFER],
      { required_error: 'Price type is required', invalid_type_error: 'Price type is required' }
    ),
    price: z
      .number({ invalid_type_error: 'Price is required' })
      .positive('Price must be greater than 0'),
    effectiveFrom: z.string().min(1, 'Effective from date is required'),
    effectiveTo: z.string().optional(),
    active: z.boolean(),
  })
  .refine(
    (values) => !values.effectiveTo || values.effectiveTo >= values.effectiveFrom,
    { message: 'Effective to date must be on or after the effective from date', path: ['effectiveTo'] }
  );

export type ProductPriceFormValues = z.infer<typeof productPriceFormSchema>;

export const PRODUCT_PRICE_FORM_DEFAULT_VALUES: ProductPriceFormValues = {
  priceType: PRICE_TYPES.RETAIL,
  price: 0,
  effectiveFrom: '',
  effectiveTo: '',
  active: true,
};
