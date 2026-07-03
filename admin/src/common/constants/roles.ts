/**
 * Backend-locked roles — see BACKEND_API_CONTRACT.md § Roles.
 * There is no granular permission matrix; access control is role-based only.
 * Never invent additional roles.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export function isRoleName(value: string): value is RoleName {
  return value === ROLES.ADMIN || value === ROLES.STAFF;
}
