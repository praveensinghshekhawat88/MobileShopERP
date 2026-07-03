import { Link } from '@mui/material';
import type { JSX } from 'react';

/** Skip navigation link — see 05_UI_STANDARDS.md § Accessibility and P11-T003. */
export function SkipToMainLink(): JSX.Element {
  return (
    <Link
      href="#main-content"
      sx={{
        position: 'absolute',
        left: -9999,
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
        zIndex: (theme) => theme.zIndex.modal + 1,
        '&:focus': {
          position: 'fixed',
          left: 16,
          top: 16,
          width: 'auto',
          height: 'auto',
          overflow: 'visible',
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          color: 'primary.main',
          borderRadius: 1,
          boxShadow: 2,
          textDecoration: 'none',
          fontWeight: 600,
        },
      }}
    >
      Skip to main content
    </Link>
  );
}
