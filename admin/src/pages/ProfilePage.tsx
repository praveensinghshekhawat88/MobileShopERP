import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { useAuth } from '@/modules/auth';
import { ProfileEditForm } from '@/modules/user/components/ProfileEditForm';
import { useUser } from '@/modules/user/hooks/useUsers';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

interface ProfileFieldProps {
  readonly label: string;
  readonly value: string | undefined;
}

function ProfileField({ label, value }: ProfileFieldProps): JSX.Element {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value ?? '—'}</Typography>
    </Box>
  );
}

/**
 * Profile page — see 04_TASKS.md P01-T005 and P10-T005. STAFF see a read-only
 * view from the auth session. ADMIN can edit their own profile via
 * `PUT /users/{id}` (no dedicated profile endpoint exists yet).
 */
export function ProfilePage(): JSX.Element {
  const { user, isAdmin } = useAuth();
  const profileQuery = useUser(isAdmin ? user?.id : undefined);

  if (isAdmin && profileQuery.isLoading) {
    return <PageLoader />;
  }

  if (isAdmin && profileQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(profileQuery.error)}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'My Profile' }]} />
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, maxWidth: 480 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={700}>
            My Profile
          </Typography>
          <Divider />
          {isAdmin && profileQuery.data ? (
            <ProfileEditForm user={profileQuery.data} />
          ) : (
            <Stack spacing={2}>
              <ProfileField label="First Name" value={user?.firstName} />
              <ProfileField label="Last Name" value={user?.lastName} />
              <ProfileField label="Mobile Number" value={user?.mobile} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Box mt={0.5}>
                  <Chip
                    label={user?.roleName ?? '—'}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
