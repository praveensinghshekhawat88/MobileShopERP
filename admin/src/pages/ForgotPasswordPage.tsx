import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack, Typography } from '@mui/material';
import { useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';

import { AppButton } from '@/components/buttons/AppButton';
import { Form } from '@/components/form/Form';
import { FormTextField } from '@/components/inputs/FormTextField';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { showInfoToast } from '@/utils/toast';

const forgotPasswordSchema = z.object({
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Reduced-scope screen — see 04_TASKS.md P01-T004: "Forgot Password UI
 * [Backend Pending — no forgot-password endpoint exists in the frozen
 * backend]." No network call is made here; per BACKEND_API_CONTRACT.md
 * § What Does NOT Exist Yet, this must not be built against an assumed API.
 * The form only collects the mobile number and informs the user that resets
 * are currently handled by an administrator.
 */
export function ForgotPasswordPage(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { mobile: '' },
  });

  const handleSubmit = (_values: ForgotPasswordFormValues): void => {
    setSubmitting(true);
    showInfoToast('Password reset is not available yet. Please contact your administrator.');
    setSubmitting(false);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <Typography variant="body2" color="text.secondary">
        Enter your registered mobile number. Password reset requests are currently handled by your
        administrator.
      </Typography>
      <FormTextField<ForgotPasswordFormValues>
        name="mobile"
        label="Mobile Number"
        autoComplete="tel"
        autoFocus
        inputMode="numeric"
      />
      <Stack spacing={2}>
        <AppButton type="submit" appVariant="primary" loading={submitting} fullWidth size="large">
          Request Reset
        </AppButton>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          <Link component={RouterLink} to={ROUTE_PATHS.login}>
            Back to Sign In
          </Link>
        </Typography>
      </Stack>
    </Form>
  );
}
