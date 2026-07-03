import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';

interface ErrorStateProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

/**
 * Generic error state — see 05_UI_STANDARDS.md § Error State: "Friendly
 * Message, Retry Button, Support Message. Never expose backend errors."
 * `message` should already be a friendly string (see `utils/apiError.ts`),
 * never a raw backend/stack-trace string.
 */
export function ErrorState({
  message = 'Something went wrong while loading this data.',
  onRetry,
}: ErrorStateProps): JSX.Element {
  return (
    <Box display="flex" justifyContent="center" width="100%" py={8}>
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={360}>
        <Box color="error.main" fontSize={48} lineHeight={0}>
          <ErrorOutlineIcon fontSize="inherit" />
        </Box>
        <Typography variant="h6" component="p">
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If this keeps happening, please contact support.
        </Typography>
        {onRetry ? (
          <Button variant="outlined" color="primary" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
