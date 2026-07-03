import { apiClient } from '@/config/axios';
import { DASHBOARD_API } from '@/modules/dashboard/api/dashboardApi';
import type {
  DateRange,
  LowStockItem,
  ProfitSummary,
  PurchaseSummary,
  RecentPurchase,
  RecentSale,
  SalesSummary,
} from '@/modules/dashboard/types/Dashboard';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page } from '@/types/Page';

interface RecentListParams extends DateRange {
  readonly page: number;
  readonly size: number;
}

interface LowStockParams {
  readonly threshold: number;
  readonly page: number;
  readonly size: number;
}

/**
 * Dashboard module service — see 03_ARCHITECTURE.md § API Architecture.
 * Every call here hits an existing, already-hardened report endpoint (see
 * BACKEND_API_CONTRACT.md § What Does Exist); the dashboard introduces no
 * new backend surface. All endpoints require `ADMIN` or `STAFF` (see the
 * respective `@PreAuthorize` on each report controller) — no extra role
 * check is needed on the frontend beyond the existing `ProtectedRoute`.
 */
export const dashboardService = {
  async getSalesSummary(range: DateRange): Promise<SalesSummary> {
    const response = await apiClient.get<ApiResponse<SalesSummary>>(DASHBOARD_API.salesSummary, {
      params: range,
    });
    return unwrap(response.data);
  },

  async getPurchaseSummary(range: DateRange): Promise<PurchaseSummary> {
    const response = await apiClient.get<ApiResponse<PurchaseSummary>>(
      DASHBOARD_API.purchaseSummary,
      { params: range }
    );
    return unwrap(response.data);
  },

  async getProfitSummary(range: DateRange): Promise<ProfitSummary> {
    const response = await apiClient.get<ApiResponse<ProfitSummary>>(DASHBOARD_API.profitSummary, {
      params: range,
    });
    return unwrap(response.data);
  },

  /**
   * `/reports/sales` orders results by `invoice_date DESC` server-side
   * regardless of any `sort` param (see `SalesReportRepository` — it is a
   * raw JDBC query, Spring Data's `Pageable.getSort()` is not applied), so
   * the most recent sales are always already first.
   */
  async getRecentSales(params: RecentListParams): Promise<Page<RecentSale>> {
    const response = await apiClient.get<ApiResponse<Page<RecentSale>>>(DASHBOARD_API.recentSales, {
      params,
    });
    return unwrap(response.data);
  },

  /** Same server-side `invoice_date DESC` ordering guarantee as `getRecentSales`. */
  async getRecentPurchases(params: RecentListParams): Promise<Page<RecentPurchase>> {
    const response = await apiClient.get<ApiResponse<Page<RecentPurchase>>>(
      DASHBOARD_API.recentPurchases,
      { params }
    );
    return unwrap(response.data);
  },

  async getLowStock(params: LowStockParams): Promise<Page<LowStockItem>> {
    const response = await apiClient.get<ApiResponse<Page<LowStockItem>>>(DASHBOARD_API.lowStock, {
      params,
    });
    return unwrap(response.data);
  },
};

function unwrap<T>(envelope: ApiResponse<T>): T {
  if (envelope.data === null) {
    throw new Error('Dashboard response did not contain data');
  }
  return envelope.data;
}
