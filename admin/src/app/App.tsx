import type { JSX } from 'react';

import { AppProviders } from '@/app/AppProviders';
import { PageLoader } from '@/components/loading/PageLoader';
import { useGlobalErrorReporting } from '@/hooks/useGlobalErrorReporting';
import { useSessionBootstrap } from '@/modules/auth';
import { AppRoutes } from '@/routes/AppRoutes';

/**
 * Gates routing behind session restoration — see 04_TASKS.md P01-T002
 * (Refresh Token) and `modules/auth/hooks/useSessionBootstrap.ts`. Rendered
 * inside `AppProviders` so it has access to Redux; showing the full-page
 * loader here (instead of inside `AppRoutes`) prevents a flash of the login
 * page before a valid refresh token has had a chance to restore the session.
 */
function AppShell(): JSX.Element {
  useGlobalErrorReporting();
  const { isBootstrapping } = useSessionBootstrap();

  if (isBootstrapping) {
    return <PageLoader />;
  }

  return <AppRoutes />;
}

/**
 * Application root — see 01_AGENTS.md § Folder Structure: `app/` is "app
 * bootstrap, providers, root router." Mounted once by `main.tsx`.
 */
export function App(): JSX.Element {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
