import { z } from 'zod';

/**
 * Client-side validation only — final authority is backend Jakarta
 * Validation. Mirrors `CreateProductRequest`/`UpdateProductRequest` (`name`
 * is `@NotBlank @Size(max = 200)`; `brandId`/`categoryId` are required
 * `@NotNull` FKs, represented as strings here for `FormSelect`).
 */
export const productFormSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be at most 200 characters'),
  model: z.string().trim().max(150, 'Model must be at most 150 characters').optional(),
  hsnCode: z.string().trim().max(20, 'HSN code must be at most 20 characters').optional(),
  description: z.string().trim().optional(),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const PRODUCT_FORM_DEFAULT_VALUES: ProductFormValues = {
  brandId: '',
  categoryId: '',
  name: '',
  model: '',
  hsnCode: '',
  description: '',
  active: true,
};
