import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Authentication layout — see 03_ARCHITECTURE.md § Layout Architecture:
 * "Authentication pages use AuthLayout." Used by the login screen (and any
 * future auth screens such as forgot-password once the backend supports it).
 */
export function AuthLayout(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={2}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <StorefrontOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" component="h1" fontWeight={700}>
              Mobile Shop ERP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your store
            </Typography>
          </Stack>
          <Outlet />
        </Stack>
      </Paper>
    </Box>
  );
}
