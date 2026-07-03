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
import { useCreatePurchase, useUpdatePurchase } from '@/modules/purchase/hooks/usePurchaseMutations';
import type { PurchaseResponse } from '@/modules/purchase/types/Purchase';
import {
  PURCHASE_FORM_DEFAULT_VALUES,
  purchaseFormSchema,
  type PurchaseFormValues,
} from '@/modules/purchase/validation/purchaseValidation';
import { useSupplierOptions } from '@/modules/supplier';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface PurchaseFormDialogProps {
  readonly open: boolean;
  readonly purchase: PurchaseResponse | null;
  readonly onClose: () => void;
  readonly onCreated?: (created: PurchaseResponse) => void;
}

const FORM_ID = 'purchase-form';

const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUSES.PENDING, label: 'Pending' },
  { value: PAYMENT_STATUSES.PARTIAL, label: 'Partial' },
  { value: PAYMENT_STATUSES.PAID, label: 'Paid' },
];

/** Create/Edit dialog for Purchase header fields — see 04_TASKS.md P06-T001. */
export function PurchaseFormDialog({
  open,
  purchase,
  onClose,
  onCreated,
}: PurchaseFormDialogProps): JSX.Element {
  const isEditMode = purchase !== null;
  const { options: supplierOptions, isLoading: suppliersLoading } = useSupplierOptions();
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const isSubmitting = createPurchase.isPending || updatePurchase.isPending;

  const methods = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: PURCHASE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      purchase
        ? {
            supplierId: purchase.supplierId,
            invoiceNumber: purchase.invoiceNumber,
            invoiceDate: purchase.invoiceDate,
            totalAmount: purchase.totalAmount,
            paymentStatus: purchase.paymentStatus,
          }
        : PURCHASE_FORM_DEFAULT_VALUES
    );
  }, [open, purchase, methods]);

  const handleSubmit = (values: PurchaseFormValues): void => {
    const request = {
      supplierId: values.supplierId,
      invoiceNumber: values.invoiceNumber,
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
      updatePurchase.mutate({ id: purchase.id, request }, { onSuccess: onClose, onError });
    } else {
      createPurchase.mutate(request, {
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
      title={isEditMode ? 'Edit Purchase' : 'New Purchase'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Purchase'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<PurchaseFormValues>
          name="supplierId"
          label="Supplier"
          options={supplierOptions}
          disabled={suppliersLoading}
        />
        <FormTextField<PurchaseFormValues> name="invoiceNumber" label="Invoice Number" autoFocus required />
        <FormDatePicker<PurchaseFormValues> name="invoiceDate" label="Invoice Date" />
        <FormNumberField<PurchaseFormValues> name="totalAmount" label="Total Amount" required />
        <FormSelect<PurchaseFormValues> name="paymentStatus" label="Payment Status" options={PAYMENT_STATUS_OPTIONS} />
      </Form>
    </BaseDialog>
  );
}
