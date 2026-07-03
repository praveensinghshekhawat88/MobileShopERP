/**
 * Raw endpoint paths backing the Customer module — see 01_AGENTS.md § Module
 * Structure: "api/ (raw endpoint path constants for this module)" and
 * `CustomerController.java`.
 */
export const CUSTOMER_API = {
  base: '/customers',
  byId: (id: string) => `/customers/${id}`,
  byMobile: (mobile: string) => `/customers/by-mobile/${mobile}`,
} as const;
