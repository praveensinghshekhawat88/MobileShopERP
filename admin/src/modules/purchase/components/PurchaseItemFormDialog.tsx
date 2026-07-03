import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { useProductVariantOptions } from '@/modules/product';
import {
  useCreatePurchaseItem,
  useUpdatePurchaseItem,
} from '@/modules/purchase/hooks/usePurchaseItemMutations';
import type { PurchaseItemResponse } from '@/modules/purchase/types/Purchase';
import {
  PURCHASE_ITEM_FORM_DEFAULT_VALUES,
  purchaseItemFormSchema,
  type PurchaseItemFormValues,
} from '@/modules/purchase/validation/purchaseItemValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface PurchaseItemFormDialogProps {
  readonly open: boolean;
  readonly purchaseId: string;
  readonly item: PurchaseItemResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'purchase-item-form';

/** Create/Edit dialog for a purchase line item — see 04_TASKS.md P06-T002. */
export function PurchaseItemFormDialog({
  open,
  purchaseId,
  item,
  onClose,
}: PurchaseItemFormDialogProps): JSX.Element {
  const isEditMode = item !== null;
  const { options: variantOptions, isLoading: variantsLoading } = useProductVariantOptions();
  const createItem = useCreatePurchaseItem();
  const updateItem = useUpdatePurchaseItem();
  const isSubmitting = createItem.isPending || updateItem.isPending;

  const methods = useForm<PurchaseItemFormValues>({
    resolver: zodResolver(purchaseItemFormSchema),
    defaultValues: PURCHASE_ITEM_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      item
        ? {
            variantId: item.variantId,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            taxAmount: item.taxAmount,
          }
        : PURCHASE_ITEM_FORM_DEFAULT_VALUES
    );
  }, [open, item, methods]);

  const handleSubmit = (values: PurchaseItemFormValues): void => {
    const request = {
      variantId: values.variantId,
      quantity: values.quantity,
      purchasePrice: values.purchasePrice,
      taxAmount: values.taxAmount,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateItem.mutate({ purchaseId, itemId: item.id, request }, { onSuccess: onClose, onError });
    } else {
      createItem.mutate({ purchaseId, request }, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Line Item' : 'Add Line Item'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<PurchaseItemFormValues>
          name="variantId"
          label="Product Variant (SKU)"
          options={variantOptions}
          disabled={variantsLoading || isEditMode}
        />
        <FormNumberField<PurchaseItemFormValues> name="quantity" label="Quantity" required />
        <FormNumberField<PurchaseItemFormValues> name="purchasePrice" label="Purchase Price" required />
        <FormNumberField<PurchaseItemFormValues> name="taxAmount" label="Tax Amount" required />
      </Form>
    </BaseDialog>
  );
}
