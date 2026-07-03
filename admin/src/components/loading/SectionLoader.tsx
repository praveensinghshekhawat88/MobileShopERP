import { Box, CircularProgress, Typography } from '@mui/material';
import type { JSX } from 'react';

interface SectionLoaderProps {
  readonly label?: string;
  readonly minHeight?: number;
}

/**
 * Loading state for a page section (e.g. a card or panel while its data is
 * fetching) — see 01_AGENTS.md § Loading Rules and 03_ARCHITECTURE.md
 * § Loading Architecture.
 */
export function SectionLoader({
  label = 'Loading…',
  minHeight = 200,
}: SectionLoaderProps): JSX.Element {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      minHeight={minHeight}
      width="100%"
    >
      <CircularProgress color="primary" size={32} aria-label={label} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
