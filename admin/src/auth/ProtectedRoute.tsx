import type { JSX } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAppSelector } from '@/store/hooks';

/**
 * Route guard — see 01_AGENTS.md § Routing and § Authentication Rules.
 *
 * Renders its child routes only when the Redux auth slice reports an
 * authenticated user; otherwise redirects to `/login`, preserving the
 * original location so the login flow (Phase 01) can return the user to
 * where they came from. This is UX-only routing — the backend's
 * `@PreAuthorize` remains the real security boundary (see 08_SECURITY.md
 * § Route Protection).
 */
export function ProtectedRoute(): JSX.Element {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
