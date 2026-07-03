import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { Form } from '@/components/form/Form';
import { FormPasswordField } from '@/components/inputs/FormPasswordField';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useAuth } from '@/modules/auth';
import { useUpdateUser } from '@/modules/user/hooks/useUserMutations';
import type { UserResponse } from '@/modules/user/types/User';
import {
  PROFILE_FORM_DEFAULT_VALUES,
  profileFormSchema,
  type ProfileFormValues,
} from '@/modules/user/validation/userValidation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthenticatedUser } from '@/store/slices/authSlice';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

const FORM_ID = 'profile-form';

interface ProfileEditFormProps {
  readonly user: UserResponse;
}

/**
 * Self-service profile editor for ADMIN — see 04_TASKS.md P10-T005. Uses
 * `PUT /users/{id}` as a workaround because no dedicated profile endpoint
 * exists. Role and active status cannot be changed here.
 */
export function ProfileEditForm({ user }: ProfileEditFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuth();
  const updateUser = useUpdateUser();
  const isSubmitting = updateUser.isPending;

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: PROFILE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    methods.reset({
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      mobile: user.mobile,
      email: user.email ?? '',
      password: '',
    });
  }, [user, methods]);

  const handleSubmit = (values: ProfileFormValues): void => {
    const request = {
      firstName: values.firstName.trim(),
      lastName: values.lastName?.trim() ? values.lastName.trim() : null,
      mobile: values.mobile.trim(),
      email: values.email?.trim() ? values.email.trim() : null,
      ...(values.password?.trim() ? { password: values.password.trim() } : {}),
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    updateUser.mutate(
      { id: user.id, request },
      {
        onSuccess: (updated) => {
          if (authUser) {
            dispatch(
              setAuthenticatedUser({
                id: updated.id,
                firstName: updated.firstName,
                lastName: updated.lastName ?? '',
                mobile: updated.mobile,
                roleName: authUser.roleName,
              })
            );
          }
          methods.reset({ ...values, password: '' });
        },
        onError,
      }
    );
  };

  return (
    <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
      <FormTextField<ProfileFormValues> name="firstName" label="First Name" required />
      <FormTextField<ProfileFormValues> name="lastName" label="Last Name" />
      <FormTextField<ProfileFormValues> name="mobile" label="Mobile" required />
      <FormTextField<ProfileFormValues> name="email" label="Email" type="email" />
      <FormPasswordField<ProfileFormValues>
        name="password"
        label="New Password"
        helperText="Leave blank to keep your current password."
      />
      <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
        Save Profile
      </AppButton>
    </Form>
  );
}
