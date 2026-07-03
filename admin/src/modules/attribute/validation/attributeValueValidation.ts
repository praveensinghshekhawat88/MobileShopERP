import { z } from 'zod';

/**
 * Mirrors `CreateAttributeValueRequest`/`UpdateAttributeValueRequest`.
 * `attributeId` is only ever submitted on create (the update endpoint does
 * not accept it — see `UpdateAttributeValueRequest.java`).
 */
export const attributeValueFormSchema = z.object({
  attributeId: z.string().min(1, 'Attribute is required'),
  value: z.string().trim().min(1, 'Value is required').max(100, 'Value must be at most 100 characters'),
  displayOrder: z.number().int().min(0, 'Display order must be 0 or greater'),
  active: z.boolean(),
});

export type AttributeValueFormValues = z.infer<typeof attributeValueFormSchema>;

export const ATTRIBUTE_VALUE_FORM_DEFAULT_VALUES: AttributeValueFormValues = {
  attributeId: '',
  value: '',
  displayOrder: 0,
  active: true,
};
