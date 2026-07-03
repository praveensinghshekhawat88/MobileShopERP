import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ClaimStatus } from '@/common/constants/claimStatus';
import type { MovementType } from '@/common/constants/movementType';
import type { PaymentStatus } from '@/common/constants/paymentStatus';
import type { ReferenceType } from '@/common/constants/referenceType';
import type { RepairStatus } from '@/common/constants/repairStatus';
import type { StockStatus } from '@/common/constants/stockStatus';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { reportService } from '@/modules/report/services/reportService';
import type {
  CustomerHistoryReport,
  ExpenseReportRow,
  ExpenseReportSummary,
  ExpenseSummaryGroupBy,
  LowStockReportRow,
  ProfitReportSummary,
  PurchaseBySupplierRow,
  PurchaseReportRow,
  PurchaseReportSummary,
  RepairReportRow,
  RepairReportSummary,
  ReportDateRange,
  SalesByCustomerRow,
  SalesReportRow,
  SalesReportSummary,
  StockMovementReportRow,
  StockSnapshotRow,
  StockUnitRow,
  SupplierPurchasesReport,
  SupplierSummaryRow,
  TopCustomerRow,
  WarrantyReportRow,
  WarrantyReportSummary,
} from '@/modules/report/types/Report';
import type { Page } from '@/types/Page';

const ENABLED_RANGE = (range: ReportDateRange): boolean => Boolean(range.fromDate && range.toDate);

export function useSalesReportSummary(range: ReportDateRange): UseQueryResult<SalesReportSummary> {
  return useQuery({
    queryKey: ['reports', 'sales', 'summary', range],
    queryFn: () => reportService.getSalesSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useSalesReportList(
  range: ReportDateRange & {
    readonly page: number;
    readonly size: number;
    readonly customerId?: string;
    readonly paymentStatus?: PaymentStatus;
    readonly sortKey?: string;
    readonly sortDirection?: SortDirection;
  }
): UseQueryResult<Page<SalesReportRow>> {
  return useQuery({
    queryKey: ['reports', 'sales', 'list', range],
    queryFn: () => reportService.listSales(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useSalesByCustomerReport(
  range: ReportDateRange & {
    readonly page: number;
    readonly size: number;
    readonly sortKey?: string;
    readonly sortDirection?: SortDirection;
  }
): UseQueryResult<Page<SalesByCustomerRow>> {
  return useQuery({
    queryKey: ['reports', 'sales', 'by-customer', range],
    queryFn: () => reportService.listSalesByCustomer(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function usePurchaseReportSummary(range: ReportDateRange): UseQueryResult<PurchaseReportSummary> {
  return useQuery({
    queryKey: ['reports', 'purchases', 'summary', range],
    queryFn: () => reportService.getPurchaseSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function usePurchaseReportList(
  range: ReportDateRange & {
    readonly page: number;
    readonly size: number;
    readonly supplierId?: string;
    readonly paymentStatus?: PaymentStatus;
    readonly sortKey?: string;
    readonly sortDirection?: SortDirection;
  }
): UseQueryResult<Page<PurchaseReportRow>> {
  return useQuery({
    queryKey: ['reports', 'purchases', 'list', range],
    queryFn: () => reportService.listPurchases(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function usePurchasesBySupplierReport(
  range: ReportDateRange & {
    readonly page: number;
    readonly size: number;
    readonly sortKey?: string;
    readonly sortDirection?: SortDirection;
  }
): UseQueryResult<Page<PurchaseBySupplierRow>> {
  return useQuery({
    queryKey: ['reports', 'purchases', 'by-supplier', range],
    queryFn: () => reportService.listPurchasesBySupplier(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useProfitReportSummary(range: ReportDateRange): UseQueryResult<ProfitReportSummary> {
  return useQuery({
    queryKey: ['reports', 'profit', 'summary', range],
    queryFn: () => reportService.getProfitSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useStockSnapshotReport(params: {
  readonly page: number;
  readonly size: number;
  readonly variantId?: string;
  readonly stockStatus?: StockStatus;
}): UseQueryResult<Page<StockSnapshotRow>> {
  return useQuery({
    queryKey: ['reports', 'stock', 'snapshot', params],
    queryFn: () => reportService.listStockSnapshot(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useStockByImeiReport(params: {
  readonly imei: string;
  readonly page: number;
  readonly size: number;
}): UseQueryResult<Page<StockUnitRow>> {
  return useQuery({
    queryKey: ['reports', 'stock', 'imei', params],
    queryFn: () => reportService.listStockByImei(params),
    enabled: Boolean(params.imei.trim()),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useStockMovementReport(params: {
  readonly page: number;
  readonly size: number;
  readonly stockId?: string;
  readonly variantId?: string;
  readonly imei?: string;
  readonly referenceType?: ReferenceType;
  readonly referenceId?: string;
  readonly movementType?: MovementType;
  readonly from?: string;
  readonly to?: string;
}): UseQueryResult<Page<StockMovementReportRow>> {
  return useQuery({
    queryKey: ['reports', 'stock', 'movements', params],
    queryFn: () => reportService.listStockMovements(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useLowStockReport(params: {
  readonly page: number;
  readonly size: number;
  readonly threshold?: number;
}): UseQueryResult<Page<LowStockReportRow>> {
  return useQuery({
    queryKey: ['reports', 'stock', 'low', params],
    queryFn: () => reportService.listLowStock(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useTopCustomersReport(params: {
  readonly page: number;
  readonly size: number;
  readonly fromDate?: string;
  readonly toDate?: string;
}): UseQueryResult<Page<TopCustomerRow>> {
  return useQuery({
    queryKey: ['reports', 'customers', 'top', params],
    queryFn: () => reportService.listTopCustomers(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useCustomerHistoryReport(
  customerId: string | undefined,
  range: ReportDateRange & { readonly page: number; readonly size: number }
): UseQueryResult<CustomerHistoryReport> {
  return useQuery({
    queryKey: ['reports', 'customers', 'history', customerId, range],
    queryFn: () => reportService.getCustomerHistory(customerId as string, range),
    enabled: Boolean(customerId) && ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useSupplierSummaryReport(
  range: ReportDateRange & { readonly page: number; readonly size: number }
): UseQueryResult<Page<SupplierSummaryRow>> {
  return useQuery({
    queryKey: ['reports', 'suppliers', 'summary', range],
    queryFn: () => reportService.listSupplierSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useSupplierPurchasesReport(
  supplierId: string | undefined,
  range: ReportDateRange & { readonly page: number; readonly size: number }
): UseQueryResult<SupplierPurchasesReport> {
  return useQuery({
    queryKey: ['reports', 'suppliers', 'purchases', supplierId, range],
    queryFn: () => reportService.getSupplierPurchases(supplierId as string, range),
    enabled: Boolean(supplierId) && ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useExpenseReportSummary(
  range: ReportDateRange & { readonly groupBy?: ExpenseSummaryGroupBy }
): UseQueryResult<ExpenseReportSummary> {
  return useQuery({
    queryKey: ['reports', 'expenses', 'summary', range],
    queryFn: () => reportService.getExpenseSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useExpenseReportList(params: {
  readonly page: number;
  readonly size: number;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly category?: string;
}): UseQueryResult<Page<ExpenseReportRow>> {
  return useQuery({
    queryKey: ['reports', 'expenses', 'list', params],
    queryFn: () => reportService.listExpenses(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useRepairReportSummary(range: ReportDateRange): UseQueryResult<RepairReportSummary> {
  return useQuery({
    queryKey: ['reports', 'repairs', 'summary', range],
    queryFn: () => reportService.getRepairSummary(range),
    enabled: ENABLED_RANGE(range),
    staleTime: STALE_TIME.default,
  });
}

export function useRepairReportList(params: {
  readonly page: number;
  readonly size: number;
  readonly repairStatus?: RepairStatus;
  readonly fromDate?: string;
  readonly toDate?: string;
}): UseQueryResult<Page<RepairReportRow>> {
  return useQuery({
    queryKey: ['reports', 'repairs', 'list', params],
    queryFn: () => reportService.listRepairs(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}

export function useWarrantyReportSummary(params: {
  readonly daysWithin?: number;
}): UseQueryResult<WarrantyReportSummary> {
  return useQuery({
    queryKey: ['reports', 'warranty', 'summary', params],
    queryFn: () => reportService.getWarrantySummary(params),
    staleTime: STALE_TIME.default,
  });
}

export function useWarrantyReportList(params: {
  readonly page: number;
  readonly size: number;
  readonly claimStatus?: ClaimStatus;
  readonly customerId?: string;
  readonly saleId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
}): UseQueryResult<Page<WarrantyReportRow>> {
  return useQuery({
    queryKey: ['reports', 'warranty', 'list', params],
    queryFn: () => reportService.listWarranties(params),
    staleTime: STALE_TIME.default,
    placeholderData: (prev) => prev,
  });
}
