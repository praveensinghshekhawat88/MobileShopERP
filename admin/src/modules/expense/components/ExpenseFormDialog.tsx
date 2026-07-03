import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormDatePicker } from '@/components/inputs/FormDatePicker';
import { FormNumberField } from '@/components/inputs/FormNumberField';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCreateExpense, useUpdateExpense } from '@/modules/expense/hooks/useExpenseMutations';
import type { ExpenseResponse } from '@/modules/expense/types/Expense';
import {
  EXPENSE_FORM_DEFAULT_VALUES,
  expenseFormSchema,
  type ExpenseFormValues,
} from '@/modules/expense/validation/expenseValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ExpenseFormDialogProps {
  readonly open: boolean;
  readonly expense: ExpenseResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'expense-form';

/** Create/Edit expense — see 04_TASKS.md P08-T003. ADMIN only (enforced server-side). */
export function ExpenseFormDialog({ open, expense, onClose }: ExpenseFormDialogProps): JSX.Element {
  const isEditMode = expense !== null;
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const isSubmitting = createExpense.isPending || updateExpense.isPending;

  const methods = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: EXPENSE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      expense
        ? {
            title: expense.title,
            amount: expense.amount,
            expenseDate: expense.expenseDate,
            remarks: expense.remarks ?? '',
          }
        : EXPENSE_FORM_DEFAULT_VALUES
    );
  }, [open, expense, methods]);

  const handleSubmit = (values: ExpenseFormValues): void => {
    const request = {
      title: values.title,
      amount: values.amount,
      expenseDate: values.expenseDate,
      remarks: values.remarks?.trim() ? values.remarks.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateExpense.mutate({ id: expense.id, request }, { onSuccess: onClose, onError });
    } else {
      createExpense.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Expense' : 'New Expense'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Expense'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<ExpenseFormValues> name="title" label="Title" autoFocus required />
        <FormNumberField<ExpenseFormValues> name="amount" label="Amount" required />
        <FormDatePicker<ExpenseFormValues> name="expenseDate" label="Expense Date" />
        <FormTextarea<ExpenseFormValues> name="remarks" label="Remarks" rows={2} />
      </Form>
    </BaseDialog>
  );
}
