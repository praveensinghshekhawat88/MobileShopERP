import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { LowStockItem } from '@/modules/dashboard/types/Dashboard';
import type { Page } from '@/types/Page';

/** Backend default threshold — see `InventoryReportController#findLowStock`. */
const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export function useLowStock(
  size = 5,
  threshold = DEFAULT_LOW_STOCK_THRESHOLD
): UseQueryResult<Page<LowStockItem>> {
  return useQuery({
    queryKey: ['dashboard', 'low-stock', threshold, size],
    queryFn: () => dashboardService.getLowStock({ threshold, page: 0, size }),
    staleTime: STALE_TIME.dashboard,
  });
}
