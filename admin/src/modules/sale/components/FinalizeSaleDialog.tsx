import { zodResolver } from '@hookform/resolvers/zod';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { PAYMENT_MODE_LABELS, PAYMENT_MODES } from '@/common/constants/paymentMode';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useFinalizeSale } from '@/modules/sale/hooks/useSaleMutations';
import {
  FINALIZE_SALE_FORM_DEFAULT_VALUES,
  finalizeSaleFormSchema,
  type FinalizeSaleFormValues,
} from '@/modules/sale/validation/paymentValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface FinalizeSaleDialogProps {
  readonly open: boolean;
  readonly saleId: string;
  readonly balanceDue: number;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

const FORM_ID = 'finalize-sale-form';

const PAYMENT_MODE_OPTIONS = Object.values(PAYMENT_MODES).map((mode) => ({
  value: mode,
  label: PAYMENT_MODE_LABELS[mode],
}));

/** Finalize sale — marks stock as SOLD and optionally records an initial payment. */
export function FinalizeSaleDialog({
  open,
  saleId,
  balanceDue,
  onClose,
  onSuccess,
}: FinalizeSaleDialogProps): JSX.Element {
  const finalizeSale = useFinalizeSale();
  const isSubmitting = finalizeSale.isPending;

  const methods = useForm<FinalizeSaleFormValues>({
    resolver: zodResolver(finalizeSaleFormSchema),
    defaultValues: FINALIZE_SALE_FORM_DEFAULT_VALUES,
  });

  const recordPayment = useWatch({ control: methods.control, name: 'recordInitialPayment' });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      ...FINALIZE_SALE_FORM_DEFAULT_VALUES,
      amount: balanceDue > 0 ? balanceDue : 0,
    });
  }, [open, balanceDue, methods]);

  const handleSubmit = (values: FinalizeSaleFormValues): void => {
    const request =
      values.recordInitialPayment && values.amount > 0
        ? {
            initialPayment: {
              paymentMode: values.paymentMode,
              amount: values.amount,
              transactionNumber: values.transactionNumber?.trim()
                ? values.transactionNumber.trim()
                : null,
            },
          }
        : undefined;

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    finalizeSale.mutate({ id: saleId, request }, { onSuccess: () => { onSuccess(); onClose(); }, onError });
  };

  return (
    <BaseDialog
      open={open}
      title="Finalize Sale"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            Finalize Sale
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Finalizing marks all line-item stock as SOLD and records stock movements. This action cannot be undone
            except by cancelling the sale (ADMIN only, not allowed if fully paid).
          </Typography>
          <Controller
            name="recordInitialPayment"
            control={methods.control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={field.onChange} />}
                label="Record initial payment now"
              />
            )}
          />
          {recordPayment ? (
            <>
              <FormSelect<FinalizeSaleFormValues> name="paymentMode" label="Payment Mode" options={PAYMENT_MODE_OPTIONS} />
              <FormNumberField<FinalizeSaleFormValues> name="amount" label="Amount" required />
              <FormTextField<FinalizeSaleFormValues> name="transactionNumber" label="Transaction Number (optional)" />
            </>
          ) : null}
        </Stack>
      </Form>
    </BaseDialog>
  );
}
