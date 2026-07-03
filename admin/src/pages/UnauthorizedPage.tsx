import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '@/components/buttons/AppButton';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * 401 — see 01_AGENTS.md § Error Handling / § Routing: "Unauthorized
 * Redirect." Shown for session-expired / not-logged-in access attempts,
 * distinct from `ForbiddenPage` (403: logged in, wrong role).
 */
export function UnauthorizedPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={420}>
        <LockOutlinedIcon color="warning" sx={{ fontSize: 72 }} />
        <Typography variant="h3" fontWeight={700}>
          401
        </Typography>
        <Typography variant="h6">Session expired</Typography>
        <Typography variant="body2" color="text.secondary">
          Your session has expired or you are not signed in. Please sign in again to continue.
        </Typography>
        <AppButton appVariant="primary" onClick={() => navigate(ROUTE_PATHS.login)}>
          Go to Login
        </AppButton>
      </Stack>
    </Box>
  );
}
