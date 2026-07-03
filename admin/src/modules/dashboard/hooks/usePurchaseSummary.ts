import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { DateRange, PurchaseSummary } from '@/modules/dashboard/types/Dashboard';

export function usePurchaseSummary(range: DateRange): UseQueryResult<PurchaseSummary> {
  return useQuery({
    queryKey: ['dashboard', 'purchase-summary', range.fromDate, range.toDate],
    queryFn: () => dashboardService.getPurchaseSummary(range),
    staleTime: STALE_TIME.dashboard,
  });
}
