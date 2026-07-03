import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { RepairStatus } from '@/common/constants/repairStatus';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { repairService } from '@/modules/repair/services/repairService';
import type { RepairResponse } from '@/modules/repair/types/Repair';
import type { Page } from '@/types/Page';

interface UseRepairsParams {
  readonly page: number;
  readonly size: number;
  readonly customerId?: string;
  readonly status?: RepairStatus;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useRepairs({
  page,
  size,
  customerId,
  status,
  sortKey,
  sortDirection,
}: UseRepairsParams): UseQueryResult<Page<RepairResponse>> {
  return useQuery({
    queryKey: ['repairs', 'list', page, size, customerId, status, sortKey, sortDirection],
    queryFn: () => repairService.list({ page, size, customerId, status, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useRepair(repairId: string | undefined): UseQueryResult<RepairResponse> {
  return useQuery({
    queryKey: ['repairs', 'detail', repairId],
    queryFn: () => repairService.getById(repairId as string),
    enabled: Boolean(repairId),
    staleTime: STALE_TIME.default,
  });
}
