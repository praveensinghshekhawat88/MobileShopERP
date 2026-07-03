import type { ClaimStatus } from '@/common/constants/claimStatus';
import type { MovementType } from '@/common/constants/movementType';
import type { PaymentStatus } from '@/common/constants/paymentStatus';
import type { ReferenceType } from '@/common/constants/referenceType';
import type { RepairStatus } from '@/common/constants/repairStatus';
import type { StockStatus } from '@/common/constants/stockStatus';
import { apiClient } from '@/config/axios';
import { REPORT_API } from '@/modules/report/api/reportApi';
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
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface PagedReportParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Report module service — read-only report endpoints (see BACKEND_API_CONTRACT.md). */
export const reportService = {
  getSalesSummary(range: ReportDateRange): Promise<SalesReportSummary> {
    return get(REPORT_API.sales.summary, range);
  },

  listSales(
    range: ReportDateRange & {
      readonly customerId?: string;
      readonly paymentStatus?: PaymentStatus;
    } & PagedReportParams
  ): Promise<Page<SalesReportRow>> {
    return getPage(REPORT_API.sales.base, range);
  },

  listSalesByCustomer(range: ReportDateRange & PagedReportParams): Promise<Page<SalesByCustomerRow>> {
    return getPage(REPORT_API.sales.byCustomer, range);
  },

  getPurchaseSummary(range: ReportDateRange): Promise<PurchaseReportSummary> {
    return get(REPORT_API.purchases.summary, range);
  },

  listPurchases(
    range: ReportDateRange & {
      readonly supplierId?: string;
      readonly paymentStatus?: PaymentStatus;
    } & PagedReportParams
  ): Promise<Page<PurchaseReportRow>> {
    return getPage(REPORT_API.purchases.base, range);
  },

  listPurchasesBySupplier(range: ReportDateRange & PagedReportParams): Promise<Page<PurchaseBySupplierRow>> {
    return getPage(REPORT_API.purchases.bySupplier, range);
  },

  getProfitSummary(range: ReportDateRange): Promise<ProfitReportSummary> {
    return get(REPORT_API.profit.summary, range);
  },

  listStockSnapshot(
    params: PagedReportParams & { readonly variantId?: string; readonly stockStatus?: StockStatus }
  ): Promise<Page<StockSnapshotRow>> {
    return getPage(REPORT_API.stock.current, params);
  },

  listStockByImei(params: PagedReportParams & { readonly imei: string }): Promise<Page<StockUnitRow>> {
    return getPage(REPORT_API.stock.current, params);
  },

  listStockMovements(
    params: PagedReportParams & {
      readonly stockId?: string;
      readonly variantId?: string;
      readonly imei?: string;
      readonly referenceType?: ReferenceType;
      readonly referenceId?: string;
      readonly movementType?: MovementType;
      readonly from?: string;
      readonly to?: string;
    }
  ): Promise<Page<StockMovementReportRow>> {
    return getPage(REPORT_API.stock.movements, params);
  },

  listLowStock(params: PagedReportParams & { readonly threshold?: number }): Promise<Page<LowStockReportRow>> {
    return getPage(REPORT_API.stock.low, params);
  },

  listTopCustomers(
    params: PagedReportParams & { readonly fromDate?: string; readonly toDate?: string }
  ): Promise<Page<TopCustomerRow>> {
    return getPage(REPORT_API.customers.top, params);
  },

  getCustomerHistory(
    customerId: string,
    range: ReportDateRange & PagedReportParams
  ): Promise<CustomerHistoryReport> {
    return get(REPORT_API.customers.history(customerId), range);
  },

  listSupplierSummary(range: ReportDateRange & PagedReportParams): Promise<Page<SupplierSummaryRow>> {
    return getPage(REPORT_API.suppliers.summary, range);
  },

  getSupplierPurchases(
    supplierId: string,
    range: ReportDateRange & PagedReportParams
  ): Promise<SupplierPurchasesReport> {
    return get(REPORT_API.suppliers.purchases(supplierId), range);
  },

  getExpenseSummary(
    range: ReportDateRange & { readonly groupBy?: ExpenseSummaryGroupBy }
  ): Promise<ExpenseReportSummary> {
    return get(REPORT_API.expenses.summary, range);
  },

  listExpenses(
    params: PagedReportParams & {
      readonly fromDate?: string;
      readonly toDate?: string;
      readonly category?: string;
    }
  ): Promise<Page<ExpenseReportRow>> {
    return getPage(REPORT_API.expenses.base, params);
  },

  getRepairSummary(range: ReportDateRange): Promise<RepairReportSummary> {
    return get(REPORT_API.repairs.summary, range);
  },

  listRepairs(
    params: PagedReportParams & {
      readonly repairStatus?: RepairStatus;
      readonly fromDate?: string;
      readonly toDate?: string;
    }
  ): Promise<Page<RepairReportRow>> {
    return getPage(REPORT_API.repairs.base, params);
  },

  getWarrantySummary(params: { readonly daysWithin?: number }): Promise<WarrantyReportSummary> {
    return get(REPORT_API.warranty.summary, params);
  },

  listWarranties(
    params: PagedReportParams & {
      readonly claimStatus?: ClaimStatus;
      readonly customerId?: string;
      readonly saleId?: string;
      readonly fromDate?: string;
      readonly toDate?: string;
    }
  ): Promise<Page<WarrantyReportRow>> {
    return getPage(REPORT_API.warranty.base, params);
  },
};

async function get<T>(url: string, params?: object): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params: cleanParams(params) });
  return unwrapApiResponse(response.data);
}

async function getPage<T>(url: string, params?: object): Promise<Page<T>> {
  const { page, size, sortKey, sortDirection, ...rest } = (params ?? {}) as PagedReportParams &
    Record<string, unknown>;
  const response = await apiClient.get<ApiResponse<Page<T>>>(url, {
    params: cleanParams({
      ...rest,
      page,
      size,
      sort: toSortParam(sortKey as string | undefined, sortDirection as 'asc' | 'desc' | undefined),
    }),
  });
  return unwrapApiResponse(response.data);
}

function cleanParams(params?: object): Record<string, unknown> | undefined {
  if (!params) {
    return undefined;
  }
  const cleaned = Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}
