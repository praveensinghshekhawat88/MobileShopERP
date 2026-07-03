import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { Box, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '@/components/buttons/AppButton';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * 403 — see 01_AGENTS.md § Error Handling: "403 → Forbidden Page." Shown when
 * an authenticated user's role (ADMIN/STAFF) does not permit an action —
 * see 01_AGENTS.md § Role & Permission Rules.
 */
export function ForbiddenPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={420}>
        <BlockOutlinedIcon color="error" sx={{ fontSize: 72 }} />
        <Typography variant="h3" fontWeight={700}>
          403
        </Typography>
        <Typography variant="h6">Access forbidden</Typography>
        <Typography variant="body2" color="text.secondary">
          You do not have permission to view this page. Contact an administrator if you believe this
          is a mistake.
        </Typography>
        <AppButton appVariant="primary" onClick={() => navigate(ROUTE_PATHS.dashboard)}>
          Back to Dashboard
        </AppButton>
      </Stack>
    </Box>
  );
}
