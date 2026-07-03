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
  useCreateSupplier,
  useUpdateSupplier,
} from '@/modules/supplier/hooks/useSupplierMutations';
import type { SupplierResponse } from '@/modules/supplier/types/Supplier';
import {
  SUPPLIER_FORM_DEFAULT_VALUES,
  supplierFormSchema,
  type SupplierFormValues,
} from '@/modules/supplier/validation/supplierValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface SupplierFormDialogProps {
  readonly open: boolean;
  readonly supplier: SupplierResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'supplier-form';

/**
 * Create/Edit dialog for the Supplier business record — see 04_TASKS.md
 * P05-T002. `supplier === null` means create mode. Only rendered for ADMIN
 * (see `SupplierController` role matrix: create/update are `hasRole('ADMIN')`).
 * Sending an empty string for `gstNumber` on update clears it server-side
 * (see `SupplierService#update`).
 */
export function SupplierFormDialog({
  open,
  supplier,
  onClose,
}: SupplierFormDialogProps): JSX.Element {
  const isEditMode = supplier !== null;
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const isSubmitting = createSupplier.isPending || updateSupplier.isPending;

  const methods = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: SUPPLIER_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      supplier
        ? {
            supplierName: supplier.supplierName,
            contactPerson: supplier.contactPerson ?? '',
            mobile: supplier.mobile,
            email: supplier.email ?? '',
            gstNumber: supplier.gstNumber ?? '',
            address: supplier.address ?? '',
          }
        : SUPPLIER_FORM_DEFAULT_VALUES
    );
  }, [open, supplier, methods]);

  const handleSubmit = (values: SupplierFormValues): void => {
    const request = {
      supplierName: values.supplierName,
      contactPerson: values.contactPerson?.trim() ? values.contactPerson.trim() : null,
      mobile: values.mobile,
      email: values.email.trim() ? values.email.trim() : null,
      gstNumber: values.gstNumber.trim() ? values.gstNumber.trim().toUpperCase() : null,
      address: values.address?.trim() ? values.address.trim() : null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateSupplier.mutate({ id: supplier.id, request }, { onSuccess: onClose, onError });
    } else {
      createSupplier.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Supplier' : 'New Supplier'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Supplier'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormTextField<SupplierFormValues>
          name="supplierName"
          label="Supplier Name"
          autoFocus
          required
        />
        <FormTextField<SupplierFormValues> name="contactPerson" label="Contact Person" />
        <FormTextField<SupplierFormValues> name="mobile" label="Mobile Number" required />
        <FormTextField<SupplierFormValues> name="email" label="Email" type="email" />
        <FormTextField<SupplierFormValues> name="gstNumber" label="GST Number" />
        <FormTextarea<SupplierFormValues> name="address" label="Address" rows={2} />
      </Form>
    </BaseDialog>
  );
}
