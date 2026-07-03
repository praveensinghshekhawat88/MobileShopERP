/**
 * Raw endpoint paths for the auth module — see 01_AGENTS.md § Module
 * Structure: "api/ (raw endpoint path constants for this module)". Relative
 * to `apiClient`'s `baseURL` (see config/axios.ts); never include the
 * `/api/v1` prefix here.
 */
export const AUTH_API = {
  login: '/auth/login',
  refresh: '/auth/refresh',
} as const;
