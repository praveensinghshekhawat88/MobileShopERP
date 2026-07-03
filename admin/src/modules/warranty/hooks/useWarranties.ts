import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { warrantyService } from '@/modules/warranty/services/warrantyService';
import type { WarrantyResponse } from '@/modules/warranty/types/Warranty';
import type { Page } from '@/types/Page';

interface UseWarrantiesParams {
  readonly page: number;
  readonly size: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useWarranties({
  page,
  size,
  sortKey,
  sortDirection,
}: UseWarrantiesParams): UseQueryResult<Page<WarrantyResponse>> {
  return useQuery({
    queryKey: ['warranties', 'list', page, size, sortKey, sortDirection],
    queryFn: () => warrantyService.list({ page, size, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useWarranty(warrantyId: string | undefined): UseQueryResult<WarrantyResponse> {
  return useQuery({
    queryKey: ['warranties', 'detail', warrantyId],
    queryFn: () => warrantyService.getById(warrantyId as string),
    enabled: Boolean(warrantyId),
    staleTime: STALE_TIME.default,
  });
}
