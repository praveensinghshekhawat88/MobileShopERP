import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Form } from '@/components/form/Form';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import { PageLoader } from '@/components/loading/PageLoader';
import { useApplicationSettings, useUpdateApplicationSettings } from '@/modules/settings/hooks/useSettings';
import {
  APPLICATION_SETTINGS_FORM_DEFAULT_VALUES,
  applicationSettingsFormSchema,
  type ApplicationSettingsFormValues,
} from '@/modules/settings/validation/settingsValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

const FORM_ID = 'application-settings-form';

interface ApplicationSettingsFormProps {
  readonly readOnly: boolean;
}

/** Shop settings form — see 04_TASKS.md P10-T004. PUT is ADMIN-only server-side. */
export function ApplicationSettingsForm({ readOnly }: ApplicationSettingsFormProps): JSX.Element {
  const settingsQuery = useApplicationSettings();
  const updateSettings = useUpdateApplicationSettings();
  const isSubmitting = updateSettings.isPending;

  const methods = useForm<ApplicationSettingsFormValues>({
    resolver: zodResolver(applicationSettingsFormSchema),
    defaultValues: APPLICATION_SETTINGS_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }
    const settings = settingsQuery.data;
    methods.reset({
      companyName: settings.companyName ?? '',
      ownerName: settings.ownerName ?? '',
      gstNumber: settings.gstNumber ?? '',
      mobile: settings.mobile ?? '',
      email: settings.email ?? '',
      address: settings.address ?? '',
      logo: settings.logo ?? '',
      invoicePrefix: settings.invoicePrefix ?? '',
    });
  }, [settingsQuery.data, methods]);

  if (settingsQuery.isLoading) {
    return <PageLoader />;
  }

  if (settingsQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(settingsQuery.error)}
        onRetry={() => void settingsQuery.refetch()}
      />
    );
  }

  const handleSubmit = (values: ApplicationSettingsFormValues): void => {
    const request = {
      companyName: values.companyName?.trim() || undefined,
      ownerName: values.ownerName?.trim() || undefined,
      gstNumber: values.gstNumber?.trim() ? values.gstNumber.trim().toUpperCase() : null,
      mobile: values.mobile?.trim() || null,
      email: values.email?.trim() ? values.email.trim() : null,
      address: values.address?.trim() || null,
      logo: values.logo?.trim() || null,
      invoicePrefix: values.invoicePrefix?.trim() || null,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    updateSettings.mutate(request, { onError });
  };

  return (
    <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
      <FormTextField<ApplicationSettingsFormValues> name="companyName" label="Company Name" disabled={readOnly} />
      <FormTextField<ApplicationSettingsFormValues> name="ownerName" label="Owner Name" disabled={readOnly} />
      <FormTextField<ApplicationSettingsFormValues> name="gstNumber" label="GST Number" disabled={readOnly} />
      <FormTextField<ApplicationSettingsFormValues> name="mobile" label="Mobile" disabled={readOnly} />
      <FormTextField<ApplicationSettingsFormValues> name="email" label="Email" type="email" disabled={readOnly} />
      <FormTextarea<ApplicationSettingsFormValues> name="address" label="Address" rows={3} disabled={readOnly} />
      <FormTextField<ApplicationSettingsFormValues> name="logo" label="Logo Path" disabled={readOnly} helperText="File path only — no upload endpoint in Phase 1." />
      <FormTextField<ApplicationSettingsFormValues> name="invoicePrefix" label="Invoice Prefix" disabled={readOnly} />
      {!readOnly ? (
        <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
          Save Settings
        </AppButton>
      ) : null}
    </Form>
  );
}
