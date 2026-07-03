import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ReferenceType } from '@/common/constants/referenceType';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { stockMovementService } from '@/modules/inventory/services/stockMovementService';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import type { Page } from '@/types/Page';

interface UseStockMovementsParams {
  readonly page: number;
  readonly size: number;
  readonly stockId?: string;
  readonly referenceType?: ReferenceType;
  readonly referenceId?: string;
  readonly from?: string;
  readonly to?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useStockMovements({
  page,
  size,
  stockId,
  referenceType,
  referenceId,
  from,
  to,
  sortKey,
  sortDirection,
}: UseStockMovementsParams): UseQueryResult<Page<StockMovementResponse>> {
  return useQuery({
    queryKey: [
      'stock-movements',
      'list',
      page,
      size,
      stockId,
      referenceType,
      referenceId,
      from,
      to,
      sortKey,
      sortDirection,
    ],
    queryFn: () =>
      stockMovementService.list({
        page,
        size,
        stockId,
        referenceType,
        referenceId,
        from,
        to,
        sortKey,
        sortDirection,
      }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
    enabled: Boolean(!referenceType || (Boolean(referenceType) && Boolean(referenceId))),
  });
}
