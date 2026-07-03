import { Box, CircularProgress } from '@mui/material';
import type { JSX } from 'react';

/**
 * Full-page loading state — see 01_AGENTS.md § Loading Rules: "Every Page →
 * Page Loader. Never show blank screens." Used as the `<Suspense>` fallback
 * for lazy-loaded routes (see 09_PERFORMANCE.md § Code Splitting).
 */
export function PageLoader(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100%"
      data-testid="page-loader"
    >
      <CircularProgress color="primary" size={40} aria-label="Loading page" />
    </Box>
  );
}
