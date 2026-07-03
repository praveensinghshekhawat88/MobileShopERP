import { z } from 'zod';

import { ATTRIBUTE_TYPES } from '@/common/constants/attributeType';

/** Mirrors `CreateAttributeRequest`/`UpdateAttributeRequest`. Select-bound ids are strings in the form. */
export const attributeFormSchema = z.object({
  attributeGroupId: z.string().min(1, 'Attribute group is required'),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  attributeType: z.enum([ATTRIBUTE_TYPES.VARIANT, ATTRIBUTE_TYPES.SPECIFICATION, ATTRIBUTE_TYPES.FILTER], {
    required_error: 'Attribute type is required',
    invalid_type_error: 'Attribute type is required',
  }),
});

export type AttributeFormValues = z.infer<typeof attributeFormSchema>;

export const ATTRIBUTE_FORM_DEFAULT_VALUES: AttributeFormValues = {
  attributeGroupId: '',
  name: '',
  attributeType: ATTRIBUTE_TYPES.SPECIFICATION,
};
