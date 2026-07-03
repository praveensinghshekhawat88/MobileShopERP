import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { JSX, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { queryClient } from '@/config/queryClient';
import { store } from '@/store/store';
import { theme } from '@/theme/theme';

import 'react-toastify/dist/ReactToastify.css';

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Composes every app-wide provider in one place — see 03_ARCHITECTURE.md
 * § High Level Architecture. Order matters: Redux and Query must wrap
 * everything that reads from them; the error boundary sits innermost around
 * routed content so provider setup failures are not silently swallowed.
 */
export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
              <ErrorBoundary>{children}</ErrorBoundary>
            </BrowserRouter>
          </LocalizationProvider>
          <ToastContainer />
        </ThemeProvider>
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
