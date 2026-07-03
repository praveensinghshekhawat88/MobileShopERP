import { z } from 'zod';

/**
 * Client-side validation only — final authority is backend Jakarta
 * Validation. Mirrors `CreateCategoryRequest`/`UpdateCategoryRequest`
 * exactly (`name` is `@NotBlank @Size(max = 100)`; `parentId` is optional —
 * empty string represents "no parent" / root category in this form).
 */
export const categoryFormSchema = z.object({
  parentId: z.string(),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().trim().optional(),
  active: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CATEGORY_FORM_DEFAULT_VALUES: CategoryFormValues = {
  parentId: '',
  name: '',
  description: '',
  active: true,
};

export const ROOT_CATEGORY_OPTION_VALUE = '';
