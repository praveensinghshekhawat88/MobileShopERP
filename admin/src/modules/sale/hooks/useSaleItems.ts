import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { saleItemService } from '@/modules/sale/services/saleItemService';
import type { SaleItemResponse } from '@/modules/sale/types/Sale';

export function useSaleItems(saleId: string | undefined): UseQueryResult<readonly SaleItemResponse[]> {
  return useQuery({
    queryKey: ['sales', 'items', saleId],
    queryFn: () => saleItemService.listBySale(saleId as string),
    enabled: Boolean(saleId),
    staleTime: STALE_TIME.default,
  });
}
