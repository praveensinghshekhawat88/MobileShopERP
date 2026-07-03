import { Box, Typography } from '@mui/material';
import type { JSX } from 'react';

/**
 * Admin layout footer — see 03_ARCHITECTURE.md § Layout Architecture
 * (App → AdminLayout → Sidebar → Topbar → Content → Footer).
 */
export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      py={2}
      px={3}
      textAlign="center"
      borderTop={(theme) => `1px solid ${theme.palette.divider}`}
    >
      <Typography variant="caption" color="text.secondary">
        © {currentYear} Mobile Shop ERP. All rights reserved.
      </Typography>
    </Box>
  );
}
