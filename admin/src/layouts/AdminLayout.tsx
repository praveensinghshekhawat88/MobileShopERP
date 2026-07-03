import { Box } from '@mui/material';
import { useState, type JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { SkipToMainLink } from '@/components/SkipToMainLink';
import { Footer } from '@/layouts/Footer';
import { Sidebar } from '@/layouts/Sidebar';
import { Topbar } from '@/layouts/Topbar';

/**
 * Admin shell layout — see 03_ARCHITECTURE.md § Layout Architecture:
 * App → AdminLayout → Sidebar → Topbar → Content → Footer.
 * Wraps every protected route via `routes/AppRoutes.tsx`.
 */
export function AdminLayout(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" minHeight="100vh">
      <SkipToMainLink />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box display="flex" flexDirection="column" flex={1} minWidth={0}>
        <Topbar onMobileMenuToggle={() => setMobileOpen((current) => !current)} />
        <Box component="main" id="main-content" tabIndex={-1} flex={1} p={{ xs: 2, md: 4 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
