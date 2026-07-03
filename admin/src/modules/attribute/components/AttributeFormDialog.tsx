import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ATTRIBUTE_TYPE_LABELS, ATTRIBUTE_TYPES } from '@/common/constants/attributeType';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useAttributeGroupOptions } from '@/modules/attribute/hooks/useAttributeGroups';
import { useCreateAttribute, useUpdateAttribute } from '@/modules/attribute/hooks/useAttributeMutations';
import type { AttributeResponse } from '@/modules/attribute/types/Attribute';
import {
  ATTRIBUTE_FORM_DEFAULT_VALUES,
  attributeFormSchema,
  type AttributeFormValues,
} from '@/modules/attribute/validation/attributeValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface AttributeFormDialogProps {
  readonly open: boolean;
  readonly attribute: AttributeResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'attribute-form';
const ATTRIBUTE_TYPE_OPTIONS = Object.values(ATTRIBUTE_TYPES).map((type) => ({
  value: type,
  label: ATTRIBUTE_TYPE_LABELS[type],
}));

/**
 * Create/Edit dialog for the Attribute master — see 04_TASKS.md P03-T004
 * and AGENTS.md § Attribute Engine. Every attribute belongs to exactly one
 * attribute group.
 */
export function AttributeFormDialog({ open, attribute, onClose }: AttributeFormDialogProps): JSX.Element {
  const isEditMode = attribute !== null;
  const { options: groupOptions, isLoading: groupsLoading } = useAttributeGroupOptions();
  const createAttribute = useCreateAttribute();
  const updateAttribute = useUpdateAttribute();
  const isSubmitting = createAttribute.isPending || updateAttribute.isPending;

  const methods = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeFormSchema),
    defaultValues: ATTRIBUTE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      attribute
        ? {
            attributeGroupId: String(attribute.attributeGroupId),
            name: attribute.name,
            attributeType: attribute.attributeType,
          }
        : ATTRIBUTE_FORM_DEFAULT_VALUES
    );
  }, [open, attribute, methods]);

  const handleSubmit = (values: AttributeFormValues): void => {
    const request = {
      attributeGroupId: Number(values.attributeGroupId),
      name: values.name,
      attributeType: values.attributeType,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateAttribute.mutate({ id: attribute.id, request }, { onSuccess: onClose, onError });
    } else {
      createAttribute.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Attribute' : 'New Attribute'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Attribute'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<AttributeFormValues>
          name="attributeGroupId"
          label="Attribute Group"
          options={groupOptions}
          disabled={groupsLoading}
        />
        <FormTextField<AttributeFormValues> name="name" label="Attribute Name" autoFocus required />
        <FormSelect<AttributeFormValues>
          name="attributeType"
          label="Attribute Type"
          options={ATTRIBUTE_TYPE_OPTIONS}
        />
      </Form>
    </BaseDialog>
  );
}
