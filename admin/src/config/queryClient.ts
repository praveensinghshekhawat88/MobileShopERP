import { MutationCache, QueryClient } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/utils/apiError';
import { showErrorToast } from '@/utils/toast';

/**
 * Typed mutation `meta` — see 01_AGENTS.md § Error Handling: "API Error →
 * Snackbar" is the default for every mutation. `suppressGlobalErrorToast`
 * is the single documented escape hatch, for the rare case a module needs a
 * context-specific error message instead of the generic `errorCode` mapping
 * (e.g. login mapping `UNAUTHORIZED` to "Invalid mobile number or password"
 * instead of the generic "session expired" copy — see
 * `modules/auth/hooks/useLogin.ts`).
 */
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      suppressGlobalErrorToast?: boolean;
    };
  }
}

/**
 * The single TanStack Query client — see 01_AGENTS.md § React Query Rules and
 * 09_PERFORMANCE.md § React Query. Server state (lists, details, everything
 * fetched from the API) belongs here, never in Redux.
 *
 * Mutation errors surface as a toast automatically (see § Snackbar Rules:
 * "API Error → Snackbar"). Query (fetch) errors are intentionally NOT
 * toasted globally — list/detail screens render their own inline error
 * state (see 05_UI_STANDARDS.md § Error State) so the user isn't spammed by
 * background refetch failures.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.meta?.suppressGlobalErrorToast) {
        return;
      }
      showErrorToast(getApiErrorMessage(error));
    },
  }),
});

/**
 * Module-specific stale time overrides — see 09_PERFORMANCE.md § React Query.
 * Import these constants from module hooks instead of hardcoding numbers.
 */
export const STALE_TIME = {
  default: 5 * 60 * 1000,
  dashboard: 1 * 60 * 1000,
  settings: 30 * 60 * 1000,
} as const;
