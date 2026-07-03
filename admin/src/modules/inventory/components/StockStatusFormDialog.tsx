import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { ALLOWED_STOCK_TRANSITIONS, STOCK_STATUS_LABELS, type StockStatus } from '@/common/constants/stockStatus';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useUpdateStockStatus } from '@/modules/inventory/hooks/useStockMutations';
import type { StockResponse } from '@/modules/inventory/types/Stock';
import {
  STOCK_STATUS_FORM_DEFAULT_VALUES,
  stockStatusFormSchema,
  type StockStatusFormValues,
} from '@/modules/inventory/validation/stockStatusValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface StockStatusFormDialogProps {
  readonly open: boolean;
  readonly stock: StockResponse;
  readonly onClose: () => void;
}

const FORM_ID = 'stock-status-form';

/** Dedicated status transition dialog — see P06-T005 and `StockStatusService`. */
export function StockStatusFormDialog({ open, stock, onClose }: StockStatusFormDialogProps): JSX.Element {
  const updateStatus = useUpdateStockStatus();
  const isSubmitting = updateStatus.isPending;

  const statusOptions = useMemo(() => {
    const allowed = ALLOWED_STOCK_TRANSITIONS[stock.stockStatus] ?? [];
    return allowed.map((status) => ({ value: status, label: STOCK_STATUS_LABELS[status as StockStatus] }));
  }, [stock.stockStatus]);

  const methods = useForm<StockStatusFormValues>({
    resolver: zodResolver(stockStatusFormSchema),
    defaultValues: STOCK_STATUS_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      newStatus: (statusOptions[0]?.value as StockStatus | undefined) ?? stock.stockStatus,
      reason: '',
    });
  }, [open, statusOptions, stock.stockStatus, methods]);

  const handleSubmit = (values: StockStatusFormValues): void => {
    const request = {
      newStatus: values.newStatus,
      reason: values.reason?.trim() ? values.reason.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    updateStatus.mutate({ id: stock.id, request }, { onSuccess: onClose, onError });
  };

  const noTransitions = statusOptions.length === 0;

  return (
    <BaseDialog
      open={open}
      title="Change Stock Status"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            form={FORM_ID}
            appVariant="primary"
            loading={isSubmitting}
            disabled={noTransitions}
          >
            Update Status
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<StockStatusFormValues>
          name="newStatus"
          label="New Status"
          options={statusOptions}
          disabled={noTransitions}
        />
        <FormTextField<StockStatusFormValues> name="reason" label="Reason (optional)" />
      </Form>
    </BaseDialog>
  );
}
