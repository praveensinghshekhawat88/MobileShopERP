/**
 * Raw endpoint paths backing the Inventory module — see 01_AGENTS.md § Module
 * Structure and `StockController.java` / `StockMovementController.java`.
 */
export const STOCK_API = {
  base: '/stock',
  byId: (id: string) => `/stock/${id}`,
  byImei: (imei: string) => `/stock/by-imei/${imei}`,
  status: (id: string) => `/stock/${id}/status`,
} as const;

export const STOCK_MOVEMENT_API = {
  base: '/stock-movements',
  byId: (id: string) => `/stock-movements/${id}`,
} as const;
