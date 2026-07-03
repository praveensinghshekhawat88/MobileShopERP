import { ROLES, type RoleName } from '@/common/constants/roles';
import { useAppSelector } from '@/store/hooks';
import type { AuthenticatedUser } from '@/store/slices/authSlice';

export interface UseAuthResult {
  readonly user: AuthenticatedUser | null;
  readonly isAuthenticated: boolean;
  readonly role: RoleName | null;
  readonly isAdmin: boolean;
  readonly isStaff: boolean;
  readonly hasRole: (...roles: readonly RoleName[]) => boolean;
}

/**
 * Single source of truth for "who is logged in and what can they see" — see
 * 08_SECURITY.md § Role Rules: "Hide UI / Disable Actions based on role
 * only." Every module should hide/disable UI through this hook instead of
 * reading `state.auth` directly, so role-check logic is never duplicated
 * (see 01_AGENTS.md § DRY Principles). This is UX-only — the backend
 * `@PreAuthorize` remains the actual security boundary.
 */
export function useAuth(): UseAuthResult {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = user?.roleName ?? null;

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: role === ROLES.ADMIN,
    isStaff: role === ROLES.STAFF,
    hasRole: (...roles) => role !== null && roles.includes(role),
  };
}
