import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { useCustomerOptions } from '@/modules/customer';
import { useRepairStockOptions } from '@/modules/inventory';
import { useCreateRepair, useUpdateRepair } from '@/modules/repair/hooks/useRepairMutations';
import type { RepairResponse } from '@/modules/repair/types/Repair';
import {
  REPAIR_FORM_DEFAULT_VALUES,
  repairFormSchema,
  type RepairFormValues,
} from '@/modules/repair/validation/repairValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface RepairFormDialogProps {
  readonly open: boolean;
  readonly repair: RepairResponse | null;
  readonly onClose: () => void;
  readonly onCreated?: (created: RepairResponse) => void;
}

const FORM_ID = 'repair-form';
const EXTERNAL_DEVICE_VALUE = '__external__';

/** Create/Edit repair ticket — see 04_TASKS.md P08-T001. Empty stock = external device. */
export function RepairFormDialog({ open, repair, onClose, onCreated }: RepairFormDialogProps): JSX.Element {
  const isEditMode = repair !== null;
  const { options: customerOptions } = useCustomerOptions();
  const { options: stockOptions } = useRepairStockOptions();
  const createRepair = useCreateRepair();
  const updateRepair = useUpdateRepair();
  const isSubmitting = createRepair.isPending || updateRepair.isPending;

  const stockSelectOptions = [
    { value: EXTERNAL_DEVICE_VALUE, label: 'External device (no stock)' },
    ...stockOptions,
  ];

  const methods = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: REPAIR_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      repair
        ? {
            customerId: repair.customerId,
            stockId: repair.stockId ?? EXTERNAL_DEVICE_VALUE,
            issueDescription: repair.issueDescription ?? '',
            estimatedCost: repair.estimatedCost ?? undefined,
            actualCost: repair.actualCost ?? undefined,
          }
        : REPAIR_FORM_DEFAULT_VALUES
    );
  }, [open, repair, methods]);

  const handleSubmit = (values: RepairFormValues): void => {
    const stockId =
      values.stockId && values.stockId !== EXTERNAL_DEVICE_VALUE ? values.stockId : null;
    const issueDescription = values.issueDescription?.trim() ? values.issueDescription.trim() : null;

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      const request = {
        customerId: values.customerId,
        stockId,
        issueDescription,
        estimatedCost: values.estimatedCost ?? null,
        actualCost: values.actualCost ?? null,
      };
      updateRepair.mutate({ id: repair.id, request }, { onSuccess: onClose, onError });
    } else {
      const request = {
        customerId: values.customerId,
        stockId,
        issueDescription,
        estimatedCost: values.estimatedCost ?? null,
      };
      createRepair.mutate(request, {
        onSuccess: (created) => {
          onClose();
          onCreated?.(created);
        },
        onError,
      });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Repair' : 'New Repair Ticket'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Repair'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<RepairFormValues> name="customerId" label="Customer" options={customerOptions} />
        <FormSelect<RepairFormValues>
          name="stockId"
          label="Device Stock (optional — external if blank)"
          options={stockSelectOptions}
        />
        <FormTextarea<RepairFormValues> name="issueDescription" label="Issue Description" rows={3} />
        <FormNumberField<RepairFormValues> name="estimatedCost" label="Estimated Cost" />
        {isEditMode ? <FormNumberField<RepairFormValues> name="actualCost" label="Actual Cost" /> : null}
      </Form>
    </BaseDialog>
  );
}
