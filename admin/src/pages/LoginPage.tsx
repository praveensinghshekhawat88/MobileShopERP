import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack, Typography } from '@mui/material';
import axios from 'axios';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

import { AppButton } from '@/components/buttons/AppButton';
import { Form } from '@/components/form/Form';
import { FormPasswordField } from '@/components/inputs/FormPasswordField';
import { FormTextField } from '@/components/inputs/FormTextField';
import { loginSchema, useLogin, type LoginFormValues } from '@/modules/auth';
import { ROUTE_PATHS } from '@/routes/routePaths';
import type { ApiResponse } from '@/types/ApiResponse';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid mobile number or password.';

/**
 * Login screen — see 04_TASKS.md P01-T001 (JWT Login). Client-side
 * validation mirrors `POST /auth/login` exactly (see
 * BACKEND_API_CONTRACT.md § Authentication Endpoints). Network flow, token
 * storage, and redirect all live in `modules/auth/hooks/useLogin.ts` — this
 * page owns only form UX and error presentation.
 */
export function LoginPage(): JSX.Element {
  const loginMutation = useLogin();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: '', password: '' },
  });

  const handleSubmit = (values: LoginFormValues): void => {
    loginMutation.mutate(values, {
      onError: (error) => {
        const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
        if (handledAsFieldErrors) {
          return;
        }

        const isUnauthorized =
          axios.isAxiosError<ApiResponse<unknown>>(error) &&
          error.response?.data?.errorCode === 'UNAUTHORIZED';

        showErrorToast(isUnauthorized ? INVALID_CREDENTIALS_MESSAGE : getApiErrorMessage(error));
        methods.resetField('password');
      },
    });
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <FormTextField<LoginFormValues>
        name="mobile"
        label="Mobile Number"
        autoComplete="tel"
        autoFocus
        inputMode="numeric"
      />
      <FormPasswordField<LoginFormValues> name="password" label="Password" />
      <Stack spacing={2}>
        <AppButton
          type="submit"
          appVariant="primary"
          loading={loginMutation.isPending}
          fullWidth
          size="large"
        >
          Sign In
        </AppButton>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Forgot your password?{' '}
          <Link component={RouterLink} to={ROUTE_PATHS.forgotPassword}>
            Reset it
          </Link>
        </Typography>
      </Stack>
    </Form>
  );
}
