/**
 * Centralized route path constants — see 01_AGENTS.md § Routing:
 * "No inline route definitions." Every navigation (`<Link>`, `navigate()`,
 * redirects) must reference these constants, never a literal string.
 */
export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  profile: '/profile',
  brands: '/brands',
  categories: '/categories',
  attributes: '/attributes',
  products: '/products',
  customers: '/customers',
  suppliers: '/suppliers',
  purchases: '/purchases',
  stock: '/stock',
  stockMovements: '/stock-movements',
  sales: '/sales',
  repairs: '/repairs',
  warranties: '/warranties',
  expenses: '/expenses',
  reports: '/reports',
  reportsSales: '/reports/sales',
  reportsPurchases: '/reports/purchases',
  reportsInventory: '/reports/inventory',
  reportsCustomers: '/reports/customers',
  reportsSuppliers: '/reports/suppliers',
  reportsRepairs: '/reports/repairs',
  reportsWarranty: '/reports/warranty',
  reportsExpenses: '/reports/expenses',
  reportsProfit: '/reports/profit',
  users: '/users',
  roles: '/roles',
  shopSettings: '/shop-settings',
  forbidden: '/403',
  unauthorized: '/401',
  notFound: '/404',
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

/**
 * Dynamic (parameterized) route builders — see 01_AGENTS.md § Routing: "No
 * inline route definitions." Every navigation to a Product detail or Variant
 * detail screen must use these instead of hand-building the path string.
 */
export function buildProductDetailPath(productId: string): string {
  return `${ROUTE_PATHS.products}/${productId}`;
}

export function buildVariantDetailPath(productId: string, variantId: string): string {
  return `${buildProductDetailPath(productId)}/variants/${variantId}`;
}

export function buildPurchaseDetailPath(purchaseId: string): string {
  return `${ROUTE_PATHS.purchases}/${purchaseId}`;
}

export function buildStockDetailPath(stockId: string): string {
  return `${ROUTE_PATHS.stock}/${stockId}`;
}

export function buildSaleDetailPath(saleId: string): string {
  return `${ROUTE_PATHS.sales}/${saleId}`;
}

export function buildSaleInvoicePath(saleId: string): string {
  return `${buildSaleDetailPath(saleId)}/invoice`;
}

export function buildRepairDetailPath(repairId: string): string {
  return `${ROUTE_PATHS.repairs}/${repairId}`;
}

export function buildCustomerReportDetailPath(
  customerId: string,
  fromDate: string,
  toDate: string
): string {
  const params = new URLSearchParams({ fromDate, toDate });
  return `${ROUTE_PATHS.reportsCustomers}/${customerId}?${params.toString()}`;
}

export function buildSupplierReportDetailPath(
  supplierId: string,
  fromDate: string,
  toDate: string
): string {
  const params = new URLSearchParams({ fromDate, toDate });
  return `${ROUTE_PATHS.reportsSuppliers}/${supplierId}?${params.toString()}`;
}
