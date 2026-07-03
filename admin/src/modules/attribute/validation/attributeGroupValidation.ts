import { z } from 'zod';

/** Mirrors `CreateAttributeGroupRequest`/`UpdateAttributeGroupRequest` (`name` is `@NotBlank @Size(max = 100)`). */
export const attributeGroupFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
});

export type AttributeGroupFormValues = z.infer<typeof attributeGroupFormSchema>;

export const ATTRIBUTE_GROUP_FORM_DEFAULT_VALUES: AttributeGroupFormValues = { name: '' };
