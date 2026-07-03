import type { PaymentStatus } from '@/common/constants/paymentStatus';

/** `fromDate`/`toDate` are `YYYY-MM-DD` strings (Spring `LocalDate` binding). */
export interface DateRange {
  readonly fromDate: string;
  readonly toDate: string;
}

/** Mirrors `SalesReportSummaryDto` — `GET /reports/sales/summary`. */
export interface SalesSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly saleCount: number;
  readonly totalAmount: number;
}

/** Mirrors `PurchaseReportSummaryDto` — `GET /reports/purchases/summary`. */
export interface PurchaseSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly purchaseCount: number;
  readonly totalAmount: number;
}

/** Mirrors `ProfitReportSummaryDto` — `GET /reports/profit/summary`. */
export interface ProfitSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly totalRevenue: number;
  readonly totalCogs: number;
  readonly totalExpenses: number;
  readonly grossProfit: number;
  readonly netProfit: number;
}

/** Mirrors `SalesReportDto` — `GET /reports/sales` (row shape only, list is paged). */
export interface RecentSale {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `PurchaseReportDto` — `GET /reports/purchases` (row shape only, list is paged). */
export interface RecentPurchase {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierMobile: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `LowStockReportDto` — `GET /reports/stock/low`. */
export interface LowStockItem {
  readonly variantId: string;
  readonly variantSku: string;
  readonly productName: string;
  readonly availableCount: number;
  readonly threshold: number;
}
