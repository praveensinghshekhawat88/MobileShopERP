import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCreateBrand, useUpdateBrand } from '@/modules/brand/hooks/useBrandMutations';
import type { BrandResponse } from '@/modules/brand/types/Brand';
import {
  BRAND_FORM_DEFAULT_VALUES,
  brandFormSchema,
  type BrandFormValues,
} from '@/modules/brand/validation/brandValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface BrandFormDialogProps {
  readonly open: boolean;
  readonly brand: BrandResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'brand-form';

/**
 * Create/Edit dialog for the Brand master — see 04_TASKS.md P03-T001 and
 * 01_AGENTS.md § Dialog Rules. `brand === null` means create mode.
 */
export function BrandFormDialog({ open, brand, onClose }: BrandFormDialogProps): JSX.Element {
  const isEditMode = brand !== null;
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const isSubmitting = createBrand.isPending || updateBrand.isPending;

  const methods = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: BRAND_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      brand
        ? { name: brand.name, description: brand.description ?? '', active: brand.active }
        : BRAND_FORM_DEFAULT_VALUES
    );
  }, [open, brand, methods]);

  const handleSubmit = (values: BrandFormValues): void => {
    const request = {
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      active: values.active,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateBrand.mutate({ id: brand.id, request }, { onSuccess: onClose, onError });
    } else {
      createBrand.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Brand' : 'New Brand'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Brand'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<BrandFormValues> name="name" label="Brand Name" autoFocus required />
        <FormTextarea<BrandFormValues> name="description" label="Description" rows={3} />
        <FormSwitch<BrandFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
