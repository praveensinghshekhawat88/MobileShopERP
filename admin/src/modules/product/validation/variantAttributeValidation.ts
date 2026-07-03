import { z } from 'zod';

/**
 * Backs the "Assign Attribute Value" dialog — mirrors
 * `CreateVariantAttributeRequest` (`attributeValueId` `@NotNull`).
 * `attributeId` only exists client-side, to narrow the value picker to a
 * single attribute's values before submitting `attributeValueId`.
 */
export const variantAttributeFormSchema = z.object({
  attributeId: z.string().min(1, 'Attribute is required'),
  attributeValueId: z.string().min(1, 'Value is required'),
});

export type VariantAttributeFormValues = z.infer<typeof variantAttributeFormSchema>;

export const VARIANT_ATTRIBUTE_FORM_DEFAULT_VALUES: VariantAttributeFormValues = {
  attributeId: '',
  attributeValueId: '',
};
