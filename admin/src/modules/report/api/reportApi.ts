/** Raw endpoint paths for the Report module — see `modules/report/controller/*.java`. */
export const REPORT_API = {
  sales: {
    base: '/reports/sales',
    summary: '/reports/sales/summary',
    byCustomer: '/reports/sales/by-customer',
  },
  purchases: {
    base: '/reports/purchases',
    summary: '/reports/purchases/summary',
    bySupplier: '/reports/purchases/by-supplier',
  },
  profit: {
    summary: '/reports/profit/summary',
  },
  stock: {
    current: '/reports/stock/current',
    movements: '/reports/stock/movements',
    low: '/reports/stock/low',
  },
  customers: {
    top: '/reports/customers/top',
    history: (customerId: string) => `/reports/customers/${customerId}/history`,
  },
  suppliers: {
    summary: '/reports/suppliers/summary',
    purchases: (supplierId: string) => `/reports/suppliers/${supplierId}/purchases`,
  },
  expenses: {
    base: '/reports/expenses',
    summary: '/reports/expenses/summary',
  },
  repairs: {
    base: '/reports/repairs',
    summary: '/reports/repairs/summary',
  },
  warranty: {
    base: '/reports/warranty',
    summary: '/reports/warranty/summary',
  },
} as const;
