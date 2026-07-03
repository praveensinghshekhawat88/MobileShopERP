import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useUpdateStockMetadata } from '@/modules/inventory/hooks/useStockMutations';
import type { StockResponse } from '@/modules/inventory/types/Stock';
import {
  STOCK_METADATA_FORM_DEFAULT_VALUES,
  stockMetadataFormSchema,
  type StockMetadataFormValues,
} from '@/modules/inventory/validation/stockValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface StockMetadataFormDialogProps {
  readonly open: boolean;
  readonly stock: StockResponse;
  readonly onClose: () => void;
}

const FORM_ID = 'stock-metadata-form';

/**
 * Edit IMEI/serial metadata — see P06-T003 and BACKEND_API_CONTRACT.md.
 * Status cannot be changed here; use `StockStatusFormDialog`.
 */
export function StockMetadataFormDialog({ open, stock, onClose }: StockMetadataFormDialogProps): JSX.Element {
  const updateStock = useUpdateStockMetadata();
  const isSubmitting = updateStock.isPending;

  const methods = useForm<StockMetadataFormValues>({
    resolver: zodResolver(stockMetadataFormSchema),
    defaultValues: STOCK_METADATA_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      imei: stock.imei ?? '',
      serialNumber: stock.serialNumber ?? '',
    });
  }, [open, stock, methods]);

  const handleSubmit = (values: StockMetadataFormValues): void => {
    const request = {
      imei: values.imei.trim() ? values.imei.trim() : null,
      serialNumber: values.serialNumber?.trim() ? values.serialNumber.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    updateStock.mutate({ id: stock.id, request }, { onSuccess: onClose, onError });
  };

  return (
    <BaseDialog
      open={open}
      title="Edit Stock Metadata"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            Save Changes
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<StockMetadataFormValues> name="imei" label="IMEI" />
        <FormTextField<StockMetadataFormValues> name="serialNumber" label="Serial Number" />
      </Form>
    </BaseDialog>
  );
}
