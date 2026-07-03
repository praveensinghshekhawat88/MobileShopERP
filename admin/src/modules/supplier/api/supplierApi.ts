/**
 * Raw endpoint paths backing the Supplier module — see 01_AGENTS.md § Module
 * Structure: "api/ (raw endpoint path constants for this module)" and
 * `SupplierController.java`.
 */
export const SUPPLIER_API = {
  base: '/suppliers',
  byId: (id: string) => `/suppliers/${id}`,
  byMobile: (mobile: string) => `/suppliers/by-mobile/${mobile}`,
} as const;
