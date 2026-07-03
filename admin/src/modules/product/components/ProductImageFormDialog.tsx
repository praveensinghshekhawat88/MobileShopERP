import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCreateProductImage, useUpdateProductImage } from '@/modules/product/hooks/useProductImageMutations';
import type { ProductImageResponse } from '@/modules/product/types/Product';
import {
  PRODUCT_IMAGE_FORM_DEFAULT_VALUES,
  productImageFormSchema,
  type ProductImageFormValues,
} from '@/modules/product/validation/productImageValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ProductImageFormDialogProps {
  readonly open: boolean;
  readonly variantId: string;
  readonly image: ProductImageResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'product-image-form';

/**
 * Create/Edit dialog for a Variant Image — see 04_TASKS.md P04-T003 and
 * AGENTS.md § Product Image Rule: "Images belong to Variant." There is no
 * `isPrimary` flag (see backend reference); the lowest `displayOrder` acts
 * as the de facto lead image.
 */
export function ProductImageFormDialog({
  open,
  variantId,
  image,
  onClose,
}: ProductImageFormDialogProps): JSX.Element {
  const isEditMode = image !== null;
  const createImage = useCreateProductImage(variantId);
  const updateImage = useUpdateProductImage(variantId);
  const isSubmitting = createImage.isPending || updateImage.isPending;

  const methods = useForm<ProductImageFormValues>({
    resolver: zodResolver(productImageFormSchema),
    defaultValues: PRODUCT_IMAGE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      image
        ? { imageUrl: image.imageUrl, displayOrder: image.displayOrder }
        : PRODUCT_IMAGE_FORM_DEFAULT_VALUES
    );
  }, [open, image, methods]);

  const handleSubmit = (values: ProductImageFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateImage.mutate(
        { imageId: image.id, request: values },
        { onSuccess: onClose, onError }
      );
    } else {
      createImage.mutate(values, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Image' : 'Add Image'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Add Image'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<ProductImageFormValues>
          name="imageUrl"
          label="Image URL"
          autoFocus
          required
          helperText="Must end with .jpg, .jpeg, .png, or .webp"
        />
        <FormNumberField<ProductImageFormValues> name="displayOrder" label="Display Order" />
      </Form>
    </BaseDialog>
  );
}
