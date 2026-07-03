import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { useAvailableStockOptions } from '@/modules/inventory';
import {
  useCreateSaleItem,
  useUpdateSaleItem,
} from '@/modules/sale/hooks/useSaleItemMutations';
import type { SaleItemResponse } from '@/modules/sale/types/Sale';
import {
  SALE_ITEM_FORM_DEFAULT_VALUES,
  saleItemFormSchema,
  type SaleItemFormValues,
} from '@/modules/sale/validation/saleItemValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface SaleItemFormDialogProps {
  readonly open: boolean;
  readonly saleId: string;
  readonly item: SaleItemResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'sale-item-form';

/** Create/Edit dialog for a sale line item — see 04_TASKS.md P07-T002. */
export function SaleItemFormDialog({ open, saleId, item, onClose }: SaleItemFormDialogProps): JSX.Element {
  const isEditMode = item !== null;
  const { options: stockOptions, isLoading: stockLoading } = useAvailableStockOptions();
  const createItem = useCreateSaleItem();
  const updateItem = useUpdateSaleItem();
  const isSubmitting = createItem.isPending || updateItem.isPending;

  const methods = useForm<SaleItemFormValues>({
    resolver: zodResolver(saleItemFormSchema),
    defaultValues: SALE_ITEM_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      item
        ? {
            stockId: item.stockId,
            sellingPrice: item.sellingPrice,
            discount: item.discount,
            taxAmount: item.taxAmount,
          }
        : SALE_ITEM_FORM_DEFAULT_VALUES
    );
  }, [open, item, methods]);

  const handleSubmit = (values: SaleItemFormValues): void => {
    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateItem.mutate(
        {
          saleId,
          itemId: item.id,
          request: {
            sellingPrice: values.sellingPrice,
            discount: values.discount,
            taxAmount: values.taxAmount,
          },
        },
        { onSuccess: onClose, onError }
      );
    } else {
      createItem.mutate(
        {
          saleId,
          request: {
            stockId: values.stockId,
            sellingPrice: values.sellingPrice,
            discount: values.discount,
            taxAmount: values.taxAmount,
          },
        },
        { onSuccess: onClose, onError }
      );
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
        {!isEditMode ? (
          <FormSelect<SaleItemFormValues>
            name="stockId"
            label="Stock Item (IMEI or accessory unit)"
            options={stockOptions}
            disabled={stockLoading}
          />
        ) : null}
        <FormNumberField<SaleItemFormValues> name="sellingPrice" label="Selling Price" required />
        <FormNumberField<SaleItemFormValues> name="discount" label="Discount" required />
        <FormNumberField<SaleItemFormValues> name="taxAmount" label="Tax Amount" required />
      </Form>
    </BaseDialog>
  );
}
