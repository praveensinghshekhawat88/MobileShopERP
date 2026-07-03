import { z } from 'zod';

/**
 * Mirrors `CreateProductVariantRequest`/`UpdateProductVariantRequest`.
 * `productId` is supplied by the route/page context, not a form field.
 * `sku` is `@NotBlank @Size(max = 100)`, globally unique; `barcode` is
 * optional and, when blank, is normalized to `null` server-side.
 */
export const productVariantFormSchema = z.object({
  sku: z.string().trim().min(1, 'SKU is required').max(100, 'SKU must be at most 100 characters'),
  barcode: z.string().trim().max(100, 'Barcode must be at most 100 characters').optional(),
  active: z.boolean(),
});

export type ProductVariantFormValues = z.infer<typeof productVariantFormSchema>;

export const PRODUCT_VARIANT_FORM_DEFAULT_VALUES: ProductVariantFormValues = {
  sku: '',
  barcode: '',
  active: true,
};
