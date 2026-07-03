import { z } from 'zod';

/**
 * Client-side validation only — final authority is backend Jakarta
 * Validation (see 08_SECURITY.md § Input Validation). Mirrors
 * `CreateBrandRequest`/`UpdateBrandRequest` exactly (`name` is
 * `@NotBlank @Size(max = 100)`).
 */
export const brandFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().trim().optional(),
  active: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const BRAND_FORM_DEFAULT_VALUES: BrandFormValues = {
  name: '',
  description: '',
  active: true,
};
