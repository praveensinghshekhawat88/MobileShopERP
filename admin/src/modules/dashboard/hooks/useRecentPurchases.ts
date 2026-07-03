import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { RecentPurchase } from '@/modules/dashboard/types/Dashboard';
import type { Page } from '@/types/Page';

const RECENT_LOOKBACK_DAYS = 90;
const API_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Widget-only query — see `useRecentSales.ts` for the fixed-lookback
 * rationale. `/reports/purchases` orders by `invoice_date DESC` server-side
 * (see `dashboardService.getRecentPurchases`).
 */
export function useRecentPurchases(size = 5): UseQueryResult<Page<RecentPurchase>> {
  const toDate = dayjs().format(API_DATE_FORMAT);
  const fromDate = dayjs().subtract(RECENT_LOOKBACK_DAYS, 'day').format(API_DATE_FORMAT);

  return useQuery({
    queryKey: ['dashboard', 'recent-purchases', fromDate, toDate, size],
    queryFn: () => dashboardService.getRecentPurchases({ fromDate, toDate, page: 0, size }),
    staleTime: STALE_TIME.dashboard,
  });
}
