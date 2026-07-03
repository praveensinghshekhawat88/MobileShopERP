import type { ClaimStatus } from '@/common/constants/claimStatus';
import type { MovementType } from '@/common/constants/movementType';
import type { PaymentStatus } from '@/common/constants/paymentStatus';
import type { ReferenceType } from '@/common/constants/referenceType';
import type { RepairStatus } from '@/common/constants/repairStatus';
import type { StockStatus } from '@/common/constants/stockStatus';

export interface ReportDateRange {
  readonly fromDate: string;
  readonly toDate: string;
}

/** Mirrors `SalesReportSummaryDto`. */
export interface SalesReportSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly saleCount: number;
  readonly totalAmount: number;
}

/** Mirrors `SalesReportDto`. */
export interface SalesReportRow {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `SalesByCustomerReportDto`. */
export interface SalesByCustomerRow {
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly saleCount: number;
  readonly totalAmount: number;
}

/** Mirrors `PurchaseReportSummaryDto`. */
export interface PurchaseReportSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly purchaseCount: number;
  readonly totalAmount: number;
}

/** Mirrors `PurchaseReportDto`. */
export interface PurchaseReportRow {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierMobile: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `PurchaseBySupplierReportDto`. */
export interface PurchaseBySupplierRow {
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierMobile: string;
  readonly purchaseCount: number;
  readonly totalAmount: number;
}

/** Mirrors `ProfitReportSummaryDto`. */
export interface ProfitReportSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly totalRevenue: number;
  readonly totalCogs: number;
  readonly totalExpenses: number;
  readonly grossProfit: number;
  readonly netProfit: number;
}

/** Mirrors `StockSnapshotReportDto`. */
export interface StockSnapshotRow {
  readonly variantId: string;
  readonly variantSku: string;
  readonly productName: string;
  readonly stockStatus: StockStatus;
  readonly quantity: number;
}

/** Mirrors `StockUnitReportDto`. */
export interface StockUnitRow {
  readonly id: string;
  readonly variantId: string;
  readonly variantSku: string;
  readonly productName: string;
  readonly imei: string | null;
  readonly serialNumber: string | null;
  readonly stockStatus: StockStatus;
}

/** Mirrors `StockMovementReportDto`. */
export interface StockMovementReportRow {
  readonly id: string;
  readonly stockId: string;
  readonly imei: string | null;
  readonly variantId: string;
  readonly variantSku: string;
  readonly productName: string;
  readonly referenceType: ReferenceType;
  readonly referenceId: string;
  readonly movementType: MovementType;
  readonly remarks: string | null;
  readonly createdAt: string;
}

/** Mirrors `LowStockReportDto`. */
export interface LowStockReportRow {
  readonly variantId: string;
  readonly variantSku: string;
  readonly productName: string;
  readonly availableCount: number;
  readonly threshold: number;
}

/** Mirrors `TopCustomerReportDto`. */
export interface TopCustomerRow {
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly customerDeleted: boolean;
  readonly saleCount: number;
  readonly totalRevenue: number;
}

/** Mirrors `CustomerSaleHistoryItemDto`. */
export interface CustomerSaleHistoryItem {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `CustomerHistoryReportDto`. */
export interface CustomerHistoryReport {
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly customerDeleted: boolean;
  readonly fromDate: string;
  readonly toDate: string;
  readonly saleCount: number;
  readonly totalAmount: number;
  readonly sales: {
    readonly content: readonly CustomerSaleHistoryItem[];
    readonly totalElements: number;
    readonly totalPages: number;
    readonly number: number;
    readonly size: number;
  };
}

/** Mirrors `SupplierSummaryReportDto`. */
export interface SupplierSummaryRow {
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierMobile: string;
  readonly supplierDeleted: boolean;
  readonly purchaseCount: number;
  readonly totalSpend: number;
  readonly outstandingAmount: number;
  readonly paidAmount: number;
}

/** Mirrors `SupplierPurchaseItemDto`. */
export interface SupplierPurchaseItem {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `SupplierPurchasesReportDto`. */
export interface SupplierPurchasesReport {
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierMobile: string;
  readonly supplierDeleted: boolean;
  readonly fromDate: string;
  readonly toDate: string;
  readonly purchaseCount: number;
  readonly totalSpend: number;
  readonly outstandingAmount: number;
  readonly paidAmount: number;
  readonly purchases: {
    readonly content: readonly SupplierPurchaseItem[];
    readonly totalElements: number;
    readonly totalPages: number;
    readonly number: number;
    readonly size: number;
  };
}

export type ExpenseSummaryGroupBy = 'DAY' | 'MONTH';

/** Mirrors `ExpenseSummaryBucketDto`. */
export interface ExpenseSummaryBucket {
  readonly periodStart: string;
  readonly expenseCount: number;
  readonly totalAmount: number;
}

/** Mirrors `ExpenseReportSummaryDto`. */
export interface ExpenseReportSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly groupBy: ExpenseSummaryGroupBy;
  readonly totalExpenseCount: number;
  readonly totalAmount: number;
  readonly buckets: readonly ExpenseSummaryBucket[];
}

/** Mirrors `ExpenseReportDto`. */
export interface ExpenseReportRow {
  readonly id: string;
  readonly title: string;
  readonly amount: number;
  readonly expenseDate: string;
  readonly remarks: string | null;
}

/** Mirrors `RepairStatusCountDto`. */
export interface RepairStatusCount {
  readonly status: RepairStatus;
  readonly count: number;
}

/** Mirrors `RepairReportSummaryDto`. */
export interface RepairReportSummary {
  readonly fromDate: string;
  readonly toDate: string;
  readonly totalOpenRepairs: number;
  readonly openByStatus: readonly RepairStatusCount[];
  readonly deliveredCount: number;
  readonly totalDeliveredCost: number;
}

/** Mirrors `RepairReportDto`. */
export interface RepairReportRow {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly stockId: string | null;
  readonly imei: string | null;
  readonly repairStatus: RepairStatus;
  readonly issueDescription: string | null;
  readonly estimatedCost: number | null;
  readonly actualCost: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Mirrors `WarrantyReportSummaryDto`. */
export interface WarrantyReportSummary {
  readonly asOfDate: string;
  readonly daysWithin: number;
  readonly activeCount: number;
  readonly expiredCount: number;
  readonly expiringSoonCount: number;
}

/** Mirrors `WarrantyReportDto`. */
export interface WarrantyReportRow {
  readonly id: string;
  readonly saleItemId: string;
  readonly saleId: string;
  readonly invoiceNumber: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly imei: string | null;
  readonly warrantyMonths: number;
  readonly startDate: string;
  readonly endDate: string;
  readonly claimStatus: ClaimStatus;
  readonly expired: boolean;
}

export type {
  ClaimStatus,
  MovementType,
  PaymentStatus,
  ReferenceType,
  RepairStatus,
  StockStatus,
};
