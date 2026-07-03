import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormTextField } from '@/components/inputs/FormTextField';
import {
  useCreateAttributeGroup,
  useUpdateAttributeGroup,
} from '@/modules/attribute/hooks/useAttributeGroupMutations';
import type { AttributeGroupResponse } from '@/modules/attribute/types/Attribute';
import {
  ATTRIBUTE_GROUP_FORM_DEFAULT_VALUES,
  attributeGroupFormSchema,
  type AttributeGroupFormValues,
} from '@/modules/attribute/validation/attributeGroupValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface AttributeGroupFormDialogProps {
  readonly open: boolean;
  readonly attributeGroup: AttributeGroupResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'attribute-group-form';

/** Create/Edit dialog for the Attribute Group master — see 04_TASKS.md P03-T003. */
export function AttributeGroupFormDialog({
  open,
  attributeGroup,
  onClose,
}: AttributeGroupFormDialogProps): JSX.Element {
  const isEditMode = attributeGroup !== null;
  const createGroup = useCreateAttributeGroup();
  const updateGroup = useUpdateAttributeGroup();
  const isSubmitting = createGroup.isPending || updateGroup.isPending;

  const methods = useForm<AttributeGroupFormValues>({
    resolver: zodResolver(attributeGroupFormSchema),
    defaultValues: ATTRIBUTE_GROUP_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(attributeGroup ? { name: attributeGroup.name } : ATTRIBUTE_GROUP_FORM_DEFAULT_VALUES);
  }, [open, attributeGroup, methods]);

  const handleSubmit = (values: AttributeGroupFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateGroup.mutate({ id: attributeGroup.id, request: values }, { onSuccess: onClose, onError });
    } else {
      createGroup.mutate(values, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Attribute Group' : 'New Attribute Group'}
      onClose={onClose}
      disableBackdropClose
      maxWidth="xs"
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Group'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<AttributeGroupFormValues> name="name" label="Group Name" autoFocus required />
      </Form>
    </BaseDialog>
  );
}
