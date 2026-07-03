import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormPasswordField } from '@/components/inputs/FormPasswordField';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useRoleOptions } from '@/modules/role/hooks/useRoles';
import { useCreateUser, useUpdateUser } from '@/modules/user/hooks/useUserMutations';
import type { UserResponse } from '@/modules/user/types/User';
import {
  USER_FORM_DEFAULT_VALUES,
  createUserFormSchema,
  updateUserFormSchema,
  type UserFormValues,
} from '@/modules/user/validation/userValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface UserFormDialogProps {
  readonly open: boolean;
  readonly user: UserResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'user-form';

/** Create/Edit user dialog — see 04_TASKS.md P10-T001. ADMIN-only (backend enforced). */
export function UserFormDialog({ open, user, onClose }: UserFormDialogProps): JSX.Element {
  const isEditMode = user !== null;
  const { options: roleOptions, isLoading: rolesLoading } = useRoleOptions();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isSubmitting = createUser.isPending || updateUser.isPending;

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? updateUserFormSchema : createUserFormSchema),
    defaultValues: USER_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      user
        ? {
            roleId: String(user.roleId),
            firstName: user.firstName,
            lastName: user.lastName ?? '',
            mobile: user.mobile,
            email: user.email ?? '',
            password: '',
            active: user.active,
          }
        : USER_FORM_DEFAULT_VALUES
    );
  }, [open, user, methods]);

  const handleSubmit = (values: UserFormValues): void => {
    const email = values.email?.trim() ? values.email.trim() : null;
    const lastName = values.lastName?.trim() ? values.lastName.trim() : null;

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      const request = {
        roleId: Number(values.roleId),
        firstName: values.firstName.trim(),
        lastName,
        mobile: values.mobile.trim(),
        email,
        active: values.active,
        ...(values.password?.trim() ? { password: values.password.trim() } : {}),
      };
      updateUser.mutate({ id: user.id, request }, { onSuccess: onClose, onError });
      return;
    }

    const request = {
      roleId: Number(values.roleId),
      firstName: values.firstName.trim(),
      lastName,
      mobile: values.mobile.trim(),
      email,
      password: values.password?.trim() ?? '',
    };
    createUser.mutate(request, { onSuccess: onClose, onError });
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit User' : 'New User'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create User'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<UserFormValues>
          name="roleId"
          label="Role"
          options={roleOptions}
          disabled={rolesLoading}
        />
        <FormTextField<UserFormValues> name="firstName" label="First Name" autoFocus required />
        <FormTextField<UserFormValues> name="lastName" label="Last Name" />
        <FormTextField<UserFormValues> name="mobile" label="Mobile" required />
        <FormTextField<UserFormValues> name="email" label="Email" type="email" />
        <FormPasswordField<UserFormValues>
          name="password"
          label={isEditMode ? 'New Password' : 'Password'}
          helperText={isEditMode ? 'Leave blank to keep the current password.' : undefined}
          required={!isEditMode}
        />
        {isEditMode ? <FormSwitch<UserFormValues> name="active" label="Active" /> : null}
      </Form>
    </BaseDialog>
  );
}
