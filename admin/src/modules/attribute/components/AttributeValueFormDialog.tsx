import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useAttributeOptions } from '@/modules/attribute/hooks/useAttributes';
import {
  useCreateAttributeValue,
  useUpdateAttributeValue,
} from '@/modules/attribute/hooks/useAttributeValueMutations';
import type { AttributeValueResponse } from '@/modules/attribute/types/Attribute';
import {
  ATTRIBUTE_VALUE_FORM_DEFAULT_VALUES,
  attributeValueFormSchema,
  type AttributeValueFormValues,
} from '@/modules/attribute/validation/attributeValueValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface AttributeValueFormDialogProps {
  readonly open: boolean;
  readonly attributeValue: AttributeValueResponse | null;
  /** Pre-selected attribute when creating from an already-filtered list (see `AttributeValuesPanel`). */
  readonly defaultAttributeId?: number;
  readonly onClose: () => void;
}

const FORM_ID = 'attribute-value-form';

/**
 * Create/Edit dialog for the Attribute Value master — see 04_TASKS.md
 * P03-T005. The attribute picker is only editable on create: the backend's
 * `UpdateAttributeValueRequest` does not accept `attributeId` (moving a
 * value to a different attribute is not supported).
 */
export function AttributeValueFormDialog({
  open,
  attributeValue,
  defaultAttributeId,
  onClose,
}: AttributeValueFormDialogProps): JSX.Element {
  const isEditMode = attributeValue !== null;
  const { options: attributeOptions, nameById, isLoading: attributesLoading } = useAttributeOptions();
  const createAttributeValue = useCreateAttributeValue();
  const updateAttributeValue = useUpdateAttributeValue();
  const isSubmitting = createAttributeValue.isPending || updateAttributeValue.isPending;

  const methods = useForm<AttributeValueFormValues>({
    resolver: zodResolver(attributeValueFormSchema),
    defaultValues: ATTRIBUTE_VALUE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      attributeValue
        ? {
            attributeId: String(attributeValue.attributeId),
            value: attributeValue.value,
            displayOrder: attributeValue.displayOrder,
            active: attributeValue.active,
          }
        : {
            ...ATTRIBUTE_VALUE_FORM_DEFAULT_VALUES,
            attributeId: defaultAttributeId ? String(defaultAttributeId) : '',
          }
    );
  }, [open, attributeValue, defaultAttributeId, methods]);

  const handleSubmit = (values: AttributeValueFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateAttributeValue.mutate(
        {
          id: attributeValue.id,
          request: { value: values.value, displayOrder: values.displayOrder, active: values.active },
        },
        { onSuccess: onClose, onError }
      );
    } else {
      createAttributeValue.mutate(
        {
          attributeId: Number(values.attributeId),
          value: values.value,
          displayOrder: values.displayOrder,
          active: values.active,
        },
        { onSuccess: onClose, onError }
      );
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Attribute Value' : 'New Attribute Value'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Value'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        {isEditMode ? (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Attribute
            </Typography>
            <Typography variant="body1">{nameById.get(attributeValue.attributeId) ?? '—'}</Typography>
          </Box>
        ) : (
          <FormSelect<AttributeValueFormValues>
            name="attributeId"
            label="Attribute"
            options={attributeOptions}
            disabled={attributesLoading}
          />
        )}
        <FormTextField<AttributeValueFormValues> name="value" label="Value" autoFocus required />
        <FormNumberField<AttributeValueFormValues> name="displayOrder" label="Display Order" />
        <FormSwitch<AttributeValueFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
