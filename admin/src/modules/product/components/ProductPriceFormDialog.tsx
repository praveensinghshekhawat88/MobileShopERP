import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PRICE_TYPES, PRICE_TYPE_LABELS } from '@/common/constants/priceType';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormDatePicker } from '@/components/inputs/FormDatePicker';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { useCreateProductPrice } from '@/modules/product/hooks/useProductPriceMutations';
import {
  PRODUCT_PRICE_FORM_DEFAULT_VALUES,
  productPriceFormSchema,
  type ProductPriceFormValues,
} from '@/modules/product/validation/productPriceValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ProductPriceFormDialogProps {
  readonly open: boolean;
  readonly variantId: string;
  readonly onClose: () => void;
}

const FORM_ID = 'product-price-form';
const PRICE_TYPE_OPTIONS = Object.values(PRICE_TYPES).map((type) => ({
  value: type,
  label: PRICE_TYPE_LABELS[type],
}));

/**
 * Create-only dialog for Price History — see 04_TASKS.md P04-T004 and
 * AGENTS.md § Product Price Rule: "Never overwrite prices. Always create new
 * record." There is no edit/delete mode; creating a new active RETAIL price
 * auto-closes the previous one server-side (see `ProductPriceService#create`).
 */
export function ProductPriceFormDialog({ open, variantId, onClose }: ProductPriceFormDialogProps): JSX.Element {
  const createPrice = useCreateProductPrice(variantId);

  const methods = useForm<ProductPriceFormValues>({
    resolver: zodResolver(productPriceFormSchema),
    defaultValues: PRODUCT_PRICE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      methods.reset(PRODUCT_PRICE_FORM_DEFAULT_VALUES);
    }
  }, [open, methods]);

  const handleSubmit = (values: ProductPriceFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    createPrice.mutate(
      {
        variantId,
        priceType: values.priceType,
        price: values.price,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo?.trim() ? values.effectiveTo.trim() : null,
        active: values.active,
      },
      { onSuccess: onClose, onError }
    );
  };

  return (
    <BaseDialog
      open={open}
      title="Add Price"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={createPrice.isPending}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={createPrice.isPending}>
            Add Price
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<ProductPriceFormValues> name="priceType" label="Price Type" options={PRICE_TYPE_OPTIONS} />
        <FormNumberField<ProductPriceFormValues> name="price" label="Price (₹)" autoFocus />
        <FormDatePicker<ProductPriceFormValues> name="effectiveFrom" label="Effective From" />
        <FormDatePicker<ProductPriceFormValues> name="effectiveTo" label="Effective To (optional)" />
        <FormSwitch<ProductPriceFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
