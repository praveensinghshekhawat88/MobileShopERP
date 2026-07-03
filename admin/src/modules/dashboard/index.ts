/**
 * `DashboardCharts` (and the `@mui/x-charts`-dependent `PeriodComparisonChart` /
 * `ComparisonChartsRow` it composes) is intentionally NOT re-exported here.
 * `DashboardPage` imports it directly via `React.lazy(() => import(...))` so
 * the heavy charting bundle stays in its own chunk (see 09_PERFORMANCE.md §
 * Lazy Loading: "Charts — Lazy") instead of being pulled into whatever else
 * imports this barrel.
 */
export { LowStockCard, LOW_STOCK_LIMIT } from '@/modules/dashboard/components/LowStockCard';
export { QuickActions } from '@/modules/dashboard/components/QuickActions';
export { RecentPurchasesCard } from '@/modules/dashboard/components/RecentPurchasesCard';
export { RecentSalesCard } from '@/modules/dashboard/components/RecentSalesCard';
export { StatCard } from '@/modules/dashboard/components/StatCard';
export { useLowStock } from '@/modules/dashboard/hooks/useLowStock';
export { useProfitSummary } from '@/modules/dashboard/hooks/useProfitSummary';
export { usePurchaseSummary } from '@/modules/dashboard/hooks/usePurchaseSummary';
export { useRecentPurchases } from '@/modules/dashboard/hooks/useRecentPurchases';
export { useRecentSales } from '@/modules/dashboard/hooks/useRecentSales';
export { useSalesSummary } from '@/modules/dashboard/hooks/useSalesSummary';
export type {
  DateRange,
  LowStockItem,
  ProfitSummary,
  PurchaseSummary,
  RecentPurchase,
  RecentSale,
  SalesSummary,
} from '@/modules/dashboard/types/Dashboard';
