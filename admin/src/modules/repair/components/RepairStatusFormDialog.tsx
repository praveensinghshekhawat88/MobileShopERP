import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  ALLOWED_REPAIR_TRANSITIONS,
  REPAIR_STATUS_LABELS,
  type RepairStatus,
} from '@/common/constants/repairStatus';
import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useUpdateRepairStatus } from '@/modules/repair/hooks/useRepairMutations';
import type { RepairResponse } from '@/modules/repair/types/Repair';
import {
  REPAIR_STATUS_FORM_DEFAULT_VALUES,
  repairStatusFormSchema,
  type RepairStatusFormValues,
} from '@/modules/repair/validation/repairStatusValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface RepairStatusFormDialogProps {
  readonly open: boolean;
  readonly repair: RepairResponse;
  readonly onClose: () => void;
}

const FORM_ID = 'repair-status-form';

/** Dedicated repair status transition dialog — see `RepairService#updateStatus`. */
export function RepairStatusFormDialog({ open, repair, onClose }: RepairStatusFormDialogProps): JSX.Element {
  const updateStatus = useUpdateRepairStatus();
  const isSubmitting = updateStatus.isPending;

  const statusOptions = useMemo(() => {
    const allowed = ALLOWED_REPAIR_TRANSITIONS[repair.repairStatus] ?? [];
    return allowed.map((status) => ({ value: status, label: REPAIR_STATUS_LABELS[status as RepairStatus] }));
  }, [repair.repairStatus]);

  const methods = useForm<RepairStatusFormValues>({
    resolver: zodResolver(repairStatusFormSchema),
    defaultValues: REPAIR_STATUS_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      repairStatus: (statusOptions[0]?.value as RepairStatus | undefined) ?? repair.repairStatus,
      reason: '',
    });
  }, [open, statusOptions, repair.repairStatus, methods]);

  const handleSubmit = (values: RepairStatusFormValues): void => {
    const request = {
      repairStatus: values.repairStatus,
      reason: values.reason?.trim() ? values.reason.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    updateStatus.mutate({ id: repair.id, request }, { onSuccess: onClose, onError });
  };

  const noTransitions = statusOptions.length === 0;

  return (
    <BaseDialog
      open={open}
      title="Update Repair Status"
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
        <FormSelect<RepairStatusFormValues>
          name="repairStatus"
          label="New Status"
          options={statusOptions}
          disabled={noTransitions}
        />
        <FormTextField<RepairStatusFormValues> name="reason" label="Reason (optional)" />
      </Form>
    </BaseDialog>
  );
}
