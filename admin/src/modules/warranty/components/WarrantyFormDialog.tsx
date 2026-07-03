import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { useSaleItems } from '@/modules/sale/hooks/useSaleItems';
import { useSaleOptions } from '@/modules/sale/hooks/useSales';
import { useCreateWarranty } from '@/modules/warranty/hooks/useWarrantyMutations';
import {
  WARRANTY_FORM_DEFAULT_VALUES,
  warrantyFormSchema,
  type WarrantyFormValues,
} from '@/modules/warranty/validation/warrantyValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface WarrantyFormDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const FORM_ID = 'warranty-form';

/** Create warranty for a sold item — see 04_TASKS.md P08-T002. */
export function WarrantyFormDialog({ open, onClose }: WarrantyFormDialogProps): JSX.Element {
  const { options: saleOptions } = useSaleOptions();
  const createWarranty = useCreateWarranty();
  const isSubmitting = createWarranty.isPending;

  const methods = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues: WARRANTY_FORM_DEFAULT_VALUES,
  });

  const selectedSaleId = useWatch({ control: methods.control, name: 'saleId' });
  const itemsQuery = useSaleItems(selectedSaleId || undefined);

  const saleItemOptions = useMemo(
    () =>
      (itemsQuery.data ?? []).map((item) => ({
        value: item.id,
        label: `Item ${item.id.slice(0, 8)}… — ${formatCurrency(item.lineTotal)}`,
      })),
    [itemsQuery.data]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(WARRANTY_FORM_DEFAULT_VALUES);
  }, [open, methods]);

  useEffect(() => {
    methods.setValue('saleItemId', '');
  }, [selectedSaleId, methods]);

  const handleSubmit = (values: WarrantyFormValues): void => {
    const request = {
      saleItemId: values.saleItemId,
      warrantyMonths: values.warrantyMonths,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    createWarranty.mutate(request, { onSuccess: onClose, onError });
  };

  return (
    <BaseDialog
      open={open}
      title="New Warranty"
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            Create Warranty
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<WarrantyFormValues> name="saleId" label="Sale Invoice" options={saleOptions} />
        <FormSelect<WarrantyFormValues>
          name="saleItemId"
          label="Sale Item"
          options={saleItemOptions}
          disabled={!selectedSaleId || itemsQuery.isLoading}
        />
        <FormNumberField<WarrantyFormValues> name="warrantyMonths" label="Warranty (months)" required />
      </Form>
    </BaseDialog>
  );
}
