import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import type { RoleName } from '@/common/constants/roles';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAppSelector } from '@/store/hooks';

interface RequireRoleProps {
  readonly allowedRoles: readonly RoleName[];
}

/**
 * Role gate for protected routes — see 08_SECURITY.md § Role Rules: "Hide UI
 * / Disable Actions based on role only" and 04_TASKS.md P01-T006 (Role Based
 * Navigation). Must be nested inside `ProtectedRoute` (authentication is
 * checked first); this component only narrows further by role and redirects
 * to `/403` on mismatch. This is a UX convenience only — the backend
 * `@PreAuthorize` remains the real security boundary (see 08_SECURITY.md
 * § Role Rules).
 *
 * No route uses this yet as of Phase 01 (only the shared Dashboard exists),
 * but every future ADMIN-only or STAFF-only route (see 04_TASKS.md Phase
 * 03+) wraps itself with `<RequireRole allowedRoles={[ROLES.ADMIN]} />`
 * instead of duplicating this check.
 */
export function RequireRole({ allowedRoles }: RequireRoleProps): JSX.Element {
  const role = useAppSelector((state) => state.auth.user?.roleName);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROUTE_PATHS.forbidden} replace />;
  }

  return <Outlet />;
}
