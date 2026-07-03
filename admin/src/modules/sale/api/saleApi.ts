/**
 * Raw endpoint paths backing the Sale module — see 01_AGENTS.md § Module
 * Structure and `SaleController.java` / `SaleItemController.java`.
 */
export const SALE_API = {
  base: '/sales',
  byId: (id: string) => `/sales/${id}`,
  finalize: (id: string) => `/sales/${id}/finalize`,
  cancel: (id: string) => `/sales/${id}/cancel`,
  items: (saleId: string) => `/sales/${saleId}/items`,
  itemById: (saleId: string, itemId: string) => `/sales/${saleId}/items/${itemId}`,
} as const;

export const PAYMENT_API = {
  base: '/payments',
  balance: '/payments/balance',
  byId: (id: string) => `/payments/${id}`,
} as const;
