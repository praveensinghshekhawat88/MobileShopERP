import { ThemeProvider } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

import authReducer, { type AuthState } from '@/store/slices/authSlice';
import settingsReducer from '@/store/slices/settingsSlice';
import themeReducer from '@/store/slices/themeSlice';
import type { RootState } from '@/store/store';
import { theme } from '@/theme/theme';

interface TestRootState extends RootState {
  readonly auth: AuthState;
}

function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      settings: settingsReducer,
    },
    preloadedState,
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  readonly preloadedState?: Partial<TestRootState>;
  readonly routerProps?: MemoryRouterProps;
  readonly queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    routerProps,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { readonly children: ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <MemoryRouter {...routerProps}>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

interface RenderHookWithProvidersOptions<TProps> extends RenderHookOptions<TProps> {
  readonly preloadedState?: Partial<TestRootState>;
  readonly queryClient?: QueryClient;
}

export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    preloadedState,
    queryClient = createTestQueryClient(),
    ...renderHookOptions
  }: RenderHookWithProvidersOptions<TProps> = {}
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { readonly children: ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...renderHook(hook, { wrapper: Wrapper, ...renderHookOptions }),
  };
}
