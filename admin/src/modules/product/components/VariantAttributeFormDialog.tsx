import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { useAttributeOptions, useAttributeValueOptions } from '@/modules/attribute';
import { useAssignVariantAttribute } from '@/modules/product/hooks/useVariantAttributeMutations';
import {
  VARIANT_ATTRIBUTE_FORM_DEFAULT_VALUES,
  variantAttributeFormSchema,
  type VariantAttributeFormValues,
} from '@/modules/product/validation/variantAttributeValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { showErrorToast } from '@/utils/toast';

interface VariantAttributeFormDialogProps {
  readonly open: boolean;
  readonly variantId: string;
  readonly onClose: () => void;
}

const FORM_ID = 'variant-attribute-form';

/**
 * "Assign Attribute Value" dialog — see 04_TASKS.md P04-T005 and AGENTS.md §
 * Attribute Engine: "attribute_groups → attributes → attribute_values →
 * product_variant_attributes." The backend enforces one value per attribute
 * per variant (see `DuplicateVariantAttributeException`); this dialog only
 * assigns a single value at a time (removal is per-row on the Attributes
 * tab), which fully covers add/remove without the bulk `replace` endpoint.
 */
export function VariantAttributeFormDialog({
  open,
  variantId,
  onClose,
}: VariantAttributeFormDialogProps): JSX.Element {
  const { options: attributeOptions, isLoading: attributesLoading } = useAttributeOptions();
  const assignAttribute = useAssignVariantAttribute(variantId);

  const methods = useForm<VariantAttributeFormValues>({
    resolver: zodResolver(variantAttributeFormSchema),
    defaultValues: VARIANT_ATTRIBUTE_FORM_DEFAULT_VALUES,
  });

  const attributeId = useWatch({ control: methods.control, name: 'attributeId' });
  const { options: valueOptions, isLoading: valuesLoading } = useAttributeValueOptions(
    attributeId ? Number(attributeId) : undefined
  );

  useEffect(() => {
    if (open) {
      methods.reset(VARIANT_ATTRIBUTE_FORM_DEFAULT_VALUES);
    }
  }, [open, methods]);

  useEffect(() => {
    methods.setValue('attributeValueId', '');
  }, [attributeId, methods]);

  const handleSubmit = (values: VariantAttributeFormValues): void => {
    assignAttribute.mutate(
      { variantId, attributeValueId: Number(values.attributeValueId) },
      {
        onSuccess: onClose,
        onError: (error) => showErrorToast(getApiErrorMessage(error)),
      }
    );
  };

  return (
    <BaseDialog
      open={open}
      title="Assign Attribute Value"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={assignAttribute.isPending}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={assignAttribute.isPending}>
            Assign
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<VariantAttributeFormValues>
          name="attributeId"
          label="Attribute"
          options={attributeOptions}
          disabled={attributesLoading}
        />
        <FormSelect<VariantAttributeFormValues>
          name="attributeValueId"
          label="Value"
          options={valueOptions}
          disabled={!attributeId || valuesLoading}
        />
      </Form>
    </BaseDialog>
  );
}
