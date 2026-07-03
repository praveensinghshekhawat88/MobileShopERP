import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PAYMENT_STATUSES } from '@/common/constants/paymentStatus';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormDatePicker } from '@/components/inputs/FormDatePicker';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCustomerOptions } from '@/modules/customer';
import { useCreateSale, useUpdateSale } from '@/modules/sale/hooks/useSaleMutations';
import type { SaleResponse } from '@/modules/sale/types/Sale';
import {
  SALE_FORM_DEFAULT_VALUES,
  saleFormSchema,
  type SaleFormValues,
} from '@/modules/sale/validation/saleValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface SaleFormDialogProps {
  readonly open: boolean;
  readonly sale: SaleResponse | null;
  readonly onClose: () => void;
  readonly onCreated?: (created: SaleResponse) => void;
}

const FORM_ID = 'sale-form';

const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUSES.PENDING, label: 'Pending' },
  { value: PAYMENT_STATUSES.PARTIAL, label: 'Partial' },
  { value: PAYMENT_STATUSES.PAID, label: 'Paid' },
];

/** Create/Edit dialog for Sale header fields — see 04_TASKS.md P07-T001. */
export function SaleFormDialog({ open, sale, onClose, onCreated }: SaleFormDialogProps): JSX.Element {
  const isEditMode = sale !== null;
  const { options: customerOptions, isLoading: customersLoading } = useCustomerOptions();
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const isSubmitting = createSale.isPending || updateSale.isPending;

  const methods = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: SALE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      sale
        ? {
            customerId: sale.customerId,
            invoiceNumber: sale.invoiceNumber,
            invoiceDate: sale.invoiceDate,
            totalAmount: sale.totalAmount,
            paymentStatus:
              sale.paymentStatus === PAYMENT_STATUSES.REFUNDED ||
              sale.paymentStatus === PAYMENT_STATUSES.CANCELLED
                ? PAYMENT_STATUSES.PENDING
                : sale.paymentStatus,
          }
        : SALE_FORM_DEFAULT_VALUES
    );
  }, [open, sale, methods]);

  const handleSubmit = (values: SaleFormValues): void => {
    const request = {
      customerId: values.customerId,
      invoiceNumber: values.invoiceNumber?.trim() ? values.invoiceNumber.trim() : undefined,
      invoiceDate: values.invoiceDate,
      totalAmount: values.totalAmount,
      paymentStatus: values.paymentStatus,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateSale.mutate({ id: sale.id, request }, { onSuccess: onClose, onError });
    } else {
      createSale.mutate(request, {
        onSuccess: (created) => {
          onCreated?.(created);
          onClose();
        },
        onError,
      });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Sale' : 'New Sale'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Sale'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<SaleFormValues>
          name="customerId"
          label="Customer"
          options={customerOptions}
          disabled={customersLoading}
        />
        <FormTextField<SaleFormValues>
          name="invoiceNumber"
          label="Invoice Number (optional — auto-generated if blank)"
        />
        <FormDatePicker<SaleFormValues> name="invoiceDate" label="Invoice Date" />
        <FormNumberField<SaleFormValues> name="totalAmount" label="Total Amount" required />
        <FormSelect<SaleFormValues> name="paymentStatus" label="Payment Status" options={PAYMENT_STATUS_OPTIONS} />
      </Form>
    </BaseDialog>
  );
}
