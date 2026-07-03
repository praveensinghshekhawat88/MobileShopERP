import { Paper, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuth } from '@/modules/auth';
import { ApplicationSettingsForm } from '@/modules/settings/components/ApplicationSettingsForm';
import { ROUTE_PATHS } from '@/routes/routePaths';

/** Application (shop) settings — see 04_TASKS.md P10-T004. STAFF read-only. */
export function ApplicationSettingsPage(): JSX.Element {
  const { isAdmin } = useAuth();

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Shop Settings' },
        ]}
      />
      <Typography variant="h5" fontWeight={700}>
        Shop Settings
      </Typography>
      {!isAdmin ? (
        <Typography variant="body2" color="text.secondary">
          Read-only view. Contact an administrator to update shop settings.
        </Typography>
      ) : null}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 640 }}>
        <ApplicationSettingsForm readOnly={!isAdmin} />
      </Paper>
    </Stack>
  );
}
