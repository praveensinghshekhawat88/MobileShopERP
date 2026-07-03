import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useBrandOptions } from '@/modules/brand';
import { useCategoryOptions } from '@/modules/category';
import { useCreateProduct, useUpdateProduct } from '@/modules/product/hooks/useProductMutations';
import type { ProductResponse } from '@/modules/product/types/Product';
import {
  PRODUCT_FORM_DEFAULT_VALUES,
  productFormSchema,
  type ProductFormValues,
} from '@/modules/product/validation/productValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ProductFormDialogProps {
  readonly open: boolean;
  readonly product: ProductResponse | null;
  readonly onClose: () => void;
  /** Called with the created product's id so the caller can navigate to its detail screen. */
  readonly onCreated?: (product: ProductResponse) => void;
}

const FORM_ID = 'product-form';

/**
 * Create/Edit dialog for the Product master — see 04_TASKS.md P04-T001 and
 * AGENTS.md § Product Structure: "Brand → Category → Product → Variant."
 * `name` uniqueness is per-brand and enforced server-side only (no client
 * pre-check — see `ProductService#validateName`).
 */
export function ProductFormDialog({ open, product, onClose, onCreated }: ProductFormDialogProps): JSX.Element {
  const isEditMode = product !== null;
  const { options: brandOptions, isLoading: brandsLoading } = useBrandOptions();
  const { options: categoryOptions, isLoading: categoriesLoading } = useCategoryOptions();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: PRODUCT_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      product
        ? {
            brandId: String(product.brandId),
            categoryId: String(product.categoryId),
            name: product.name,
            model: product.model ?? '',
            hsnCode: product.hsnCode ?? '',
            description: product.description ?? '',
            active: product.active,
          }
        : PRODUCT_FORM_DEFAULT_VALUES
    );
  }, [open, product, methods]);

  const handleSubmit = (values: ProductFormValues): void => {
    const request = {
      brandId: Number(values.brandId),
      categoryId: Number(values.categoryId),
      name: values.name,
      model: values.model?.trim() ? values.model.trim() : null,
      hsnCode: values.hsnCode?.trim() ? values.hsnCode.trim() : null,
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
      updateProduct.mutate({ id: product.id, request }, { onSuccess: onClose, onError });
    } else {
      createProduct.mutate(request, {
        onSuccess: (created) => {
          onClose();
          onCreated?.(created);
        },
        onError,
      });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Product' : 'New Product'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<ProductFormValues>
          name="brandId"
          label="Brand"
          options={brandOptions}
          disabled={brandsLoading}
        />
        <FormSelect<ProductFormValues>
          name="categoryId"
          label="Category"
          options={categoryOptions}
          disabled={categoriesLoading}
        />
        <FormTextField<ProductFormValues> name="name" label="Product Name" autoFocus required />
        <FormTextField<ProductFormValues> name="model" label="Model" />
        <FormTextField<ProductFormValues> name="hsnCode" label="HSN Code" />
        <FormTextarea<ProductFormValues> name="description" label="Description" rows={3} />
        <FormSwitch<ProductFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
