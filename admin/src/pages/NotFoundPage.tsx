import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { Box, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '@/components/buttons/AppButton';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * 404 — see 01_AGENTS.md § Error Handling: "404 → Not Found."
 */
export function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={420}>
        <SearchOffOutlinedIcon color="disabled" sx={{ fontSize: 72 }} />
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h6">Page not found</Typography>
        <Typography variant="body2" color="text.secondary">
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <AppButton appVariant="primary" onClick={() => navigate(ROUTE_PATHS.dashboard)}>
          Back to Dashboard
        </AppButton>
      </Stack>
    </Box>
  );
}
