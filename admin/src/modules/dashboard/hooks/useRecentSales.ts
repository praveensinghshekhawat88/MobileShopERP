import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { RecentSale } from '@/modules/dashboard/types/Dashboard';
import type { Page } from '@/types/Page';

const RECENT_LOOKBACK_DAYS = 90;
const API_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Widget-only query — "recent" is intentionally a fixed 90-day lookback
 * rather than a caller-configurable range (see 04_TASKS.md P02-T004:
 * "Recent Sales"). `/reports/sales` already orders by `invoice_date DESC`
 * server-side (see `dashboardService.getRecentSales`), so the first `size`
 * rows are always the most recent.
 */
export function useRecentSales(size = 5): UseQueryResult<Page<RecentSale>> {
  const toDate = dayjs().format(API_DATE_FORMAT);
  const fromDate = dayjs().subtract(RECENT_LOOKBACK_DAYS, 'day').format(API_DATE_FORMAT);

  return useQuery({
    queryKey: ['dashboard', 'recent-sales', fromDate, toDate, size],
    queryFn: () => dashboardService.getRecentSales({ fromDate, toDate, page: 0, size }),
    staleTime: STALE_TIME.dashboard,
  });
}
