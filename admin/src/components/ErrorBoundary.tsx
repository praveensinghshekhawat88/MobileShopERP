import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { reportClientError } from '@/utils/errorReporting';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

/**
 * Global error boundary — see 01_AGENTS.md § Error Handling: "Unexpected
 * Error → Error Boundary" and 03_ARCHITECTURE.md § Error Architecture.
 *
 * React (as of React 19) has no hook-based equivalent of
 * `componentDidCatch`/`getDerivedStateFromError` — a class component is the
 * only supported way to implement an error boundary. This is the single,
 * deliberate exception to the "functional components only" rule in
 * 01_AGENTS.md § React Rules, required by the React API itself.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportClientError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  private handleReload = (): void => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding={6}
        textAlign="center"
        role="alert"
        aria-live="assertive"
      >
        <Stack spacing={3} alignItems="center" maxWidth={420}>
          <Typography variant="h4" component="h1">
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary">
            An unexpected error occurred. Please try reloading the page. If the problem continues,
            contact support.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={this.handleReload}
          >
            Reload Page
          </Button>
        </Stack>
      </Box>
    );
  }
}
