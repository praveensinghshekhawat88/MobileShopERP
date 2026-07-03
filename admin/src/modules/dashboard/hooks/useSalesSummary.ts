import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { DateRange, SalesSummary } from '@/modules/dashboard/types/Dashboard';

export function useSalesSummary(range: DateRange): UseQueryResult<SalesSummary> {
  return useQuery({
    queryKey: ['dashboard', 'sales-summary', range.fromDate, range.toDate],
    queryFn: () => dashboardService.getSalesSummary(range),
    staleTime: STALE_TIME.dashboard,
  });
}
