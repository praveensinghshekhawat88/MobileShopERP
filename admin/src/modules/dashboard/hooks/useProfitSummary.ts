import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { dashboardService } from '@/modules/dashboard/services/dashboardService';
import type { DateRange, ProfitSummary } from '@/modules/dashboard/types/Dashboard';

export function useProfitSummary(range: DateRange): UseQueryResult<ProfitSummary> {
  return useQuery({
    queryKey: ['dashboard', 'profit-summary', range.fromDate, range.toDate],
    queryFn: () => dashboardService.getProfitSummary(range),
    staleTime: STALE_TIME.dashboard,
  });
}
