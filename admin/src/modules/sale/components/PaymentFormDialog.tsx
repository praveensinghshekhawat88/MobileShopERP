import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PAYMENT_MODE_LABELS, PAYMENT_MODES } from '@/common/constants/paymentMode';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCreatePayment } from '@/modules/sale/hooks/usePaymentMutations';
import {
  PAYMENT_FORM_DEFAULT_VALUES,
  paymentFormSchema,
  type PaymentFormValues,
} from '@/modules/sale/validation/paymentValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface PaymentFormDialogProps {
  readonly open: boolean;
  readonly saleId: string;
  readonly maxAmount?: number;
  readonly onClose: () => void;
}

const FORM_ID = 'payment-form';

const PAYMENT_MODE_OPTIONS = Object.values(PAYMENT_MODES).map((mode) => ({
  value: mode,
  label: PAYMENT_MODE_LABELS[mode],
}));

/** Record a payment against a sale — see 04_TASKS.md P07-T003. */
export function PaymentFormDialog({ open, saleId, maxAmount, onClose }: PaymentFormDialogProps): JSX.Element {
  const createPayment = useCreatePayment();
  const isSubmitting = createPayment.isPending;

  const methods = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: PAYMENT_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      ...PAYMENT_FORM_DEFAULT_VALUES,
      amount: maxAmount && maxAmount > 0 ? maxAmount : 0,
    });
  }, [open, maxAmount, methods]);

  const handleSubmit = (values: PaymentFormValues): void => {
    const request = {
      referenceType: REFERENCE_TYPES.SALE,
      referenceId: saleId,
      paymentMode: values.paymentMode,
      amount: values.amount,
      transactionNumber: values.transactionNumber?.trim() ? values.transactionNumber.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    createPayment.mutate(request, { onSuccess: onClose, onError });
  };

  return (
    <BaseDialog
      open={open}
      title="Record Payment"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            Record Payment
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<PaymentFormValues> name="paymentMode" label="Payment Mode" options={PAYMENT_MODE_OPTIONS} />
        <FormNumberField<PaymentFormValues> name="amount" label="Amount" required />
        <FormTextField<PaymentFormValues> name="transactionNumber" label="Transaction Number (optional)" />
      </Form>
    </BaseDialog>
  );
}
