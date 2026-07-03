/**
 * Raw endpoint paths backing the dashboard — see 01_AGENTS.md § Module
 * Structure: "api/ (raw endpoint path constants for this module)". These
 * are read-only report endpoints (see BACKEND_API_CONTRACT.md § What Does
 * Exist: report controllers); the dashboard never writes data.
 */
export const DASHBOARD_API = {
  salesSummary: '/reports/sales/summary',
  purchaseSummary: '/reports/purchases/summary',
  profitSummary: '/reports/profit/summary',
  recentSales: '/reports/sales',
  recentPurchases: '/reports/purchases',
  lowStock: '/reports/stock/low',
} as const;
