import { z } from 'zod';

/**
 * Mirrors `CreateProductImageRequest`/`UpdateProductImageRequest` plus the
 * backend's service-level image URL format check (see
 * `ProductImageService#validateImageUrl`: must end with `.jpg`, `.jpeg`,
 * `.png`, or `.webp`, optionally followed by a query string). Validating the
 * extension client-side gives immediate feedback instead of a round-trip
 * `BUSINESS_RULE_VIOLATION`.
 */
const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|webp)(\?.*)?$/i;

export const productImageFormSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Image URL is required')
    .regex(IMAGE_URL_PATTERN, 'Image URL must end with .jpg, .jpeg, .png, or .webp'),
  displayOrder: z.number().int().min(0, 'Display order must be 0 or greater'),
});

export type ProductImageFormValues = z.infer<typeof productImageFormSchema>;

export const PRODUCT_IMAGE_FORM_DEFAULT_VALUES: ProductImageFormValues = {
  imageUrl: '',
  displayOrder: 0,
};
