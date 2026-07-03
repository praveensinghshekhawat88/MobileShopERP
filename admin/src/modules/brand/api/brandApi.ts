/**
 * Raw endpoint paths backing the Brand master — see 01_AGENTS.md § Module
 * Structure: "api/ (raw endpoint path constants for this module)" and
 * `BrandController.java`.
 */
export const BRAND_API = {
  base: '/brands',
  byId: (id: number) => `/brands/${id}`,
  deactivate: (id: number) => `/brands/${id}/deactivate`,
} as const;
