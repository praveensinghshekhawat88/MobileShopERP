import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextField } from '@/components/inputs/FormTextField';
import {
  useCreateProductVariant,
  useUpdateProductVariant,
} from '@/modules/product/hooks/useProductVariantMutations';
import type { ProductVariantResponse } from '@/modules/product/types/Product';
import {
  PRODUCT_VARIANT_FORM_DEFAULT_VALUES,
  productVariantFormSchema,
  type ProductVariantFormValues,
} from '@/modules/product/validation/productVariantValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ProductVariantFormDialogProps {
  readonly open: boolean;
  readonly productId: string;
  readonly variant: ProductVariantResponse | null;
  readonly onClose: () => void;
  readonly onCreated?: (variant: ProductVariantResponse) => void;
}

const FORM_ID = 'product-variant-form';

/**
 * Create/Edit dialog for a Product Variant — see 04_TASKS.md P04-T002 and
 * AGENTS.md § Product Structure: "Variant represents Actual Sellable Item."
 * `productId` is fixed by the owning Product detail screen, never editable.
 */
export function ProductVariantFormDialog({
  open,
  productId,
  variant,
  onClose,
  onCreated,
}: ProductVariantFormDialogProps): JSX.Element {
  const isEditMode = variant !== null;
  const createVariant = useCreateProductVariant();
  const updateVariant = useUpdateProductVariant();
  const isSubmitting = createVariant.isPending || updateVariant.isPending;

  const methods = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantFormSchema),
    defaultValues: PRODUCT_VARIANT_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      variant
        ? { sku: variant.sku, barcode: variant.barcode ?? '', active: variant.active }
        : PRODUCT_VARIANT_FORM_DEFAULT_VALUES
    );
  }, [open, variant, methods]);

  const handleSubmit = (values: ProductVariantFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateVariant.mutate(
        {
          id: variant.id,
          request: {
            sku: values.sku,
            barcode: values.barcode?.trim() ? values.barcode.trim() : null,
            active: values.active,
          },
        },
        { onSuccess: onClose, onError }
      );
    } else {
      createVariant.mutate(
        {
          productId,
          sku: values.sku,
          barcode: values.barcode?.trim() ? values.barcode.trim() : null,
          active: values.active,
        },
        {
          onSuccess: (created) => {
            onClose();
            onCreated?.(created);
          },
          onError,
        }
      );
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Variant' : 'New Variant'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Variant'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<ProductVariantFormValues> name="sku" label="SKU" autoFocus required />
        <FormTextField<ProductVariantFormValues> name="barcode" label="Barcode" />
        <FormSwitch<ProductVariantFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
