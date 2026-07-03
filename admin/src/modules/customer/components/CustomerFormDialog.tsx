import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import {
  useCreateCustomer,
  useUpdateCustomer,
} from '@/modules/customer/hooks/useCustomerMutations';
import type { CustomerResponse } from '@/modules/customer/types/Customer';
import {
  CUSTOMER_FORM_DEFAULT_VALUES,
  customerFormSchema,
  type CustomerFormValues,
} from '@/modules/customer/validation/customerValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface CustomerFormDialogProps {
  readonly open: boolean;
  readonly customer: CustomerResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'customer-form';

/**
 * Create/Edit dialog for the Customer business record — see 04_TASKS.md
 * P05-T001. `customer === null` means create mode. Sending an empty string
 * for `gstNumber` on update clears it server-side (see `CustomerService#update`).
 */
export function CustomerFormDialog({
  open,
  customer,
  onClose,
}: CustomerFormDialogProps): JSX.Element {
  const isEditMode = customer !== null;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: CUSTOMER_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      customer
        ? {
            name: customer.name,
            mobile: customer.mobile,
            email: customer.email ?? '',
            address: customer.address ?? '',
            gstNumber: customer.gstNumber ?? '',
          }
        : CUSTOMER_FORM_DEFAULT_VALUES
    );
  }, [open, customer, methods]);

  const handleSubmit = (values: CustomerFormValues): void => {
    const request = {
      name: values.name,
      mobile: values.mobile,
      email: values.email.trim() ? values.email.trim() : null,
      address: values.address?.trim() ? values.address.trim() : null,
      gstNumber: values.gstNumber.trim() ? values.gstNumber.trim().toUpperCase() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateCustomer.mutate({ id: customer.id, request }, { onSuccess: onClose, onError });
    } else {
      createCustomer.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Customer' : 'New Customer'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Customer'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<CustomerFormValues> name="name" label="Customer Name" autoFocus required />
        <FormTextField<CustomerFormValues> name="mobile" label="Mobile Number" required />
        <FormTextField<CustomerFormValues> name="email" label="Email" type="email" />
        <FormTextarea<CustomerFormValues> name="address" label="Address" rows={2} />
        <FormTextField<CustomerFormValues> name="gstNumber" label="GST Number" />
      </Form>
    </BaseDialog>
  );
}
