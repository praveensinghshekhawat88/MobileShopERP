import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { purchaseItemService } from '@/modules/purchase/services/purchaseItemService';
import type { PurchaseItemResponse } from '@/modules/purchase/types/Purchase';

export function usePurchaseItems(purchaseId: string | undefined): UseQueryResult<readonly PurchaseItemResponse[]> {
  return useQuery({
    queryKey: ['purchases', 'items', purchaseId],
    queryFn: () => purchaseItemService.listByPurchase(purchaseId as string),
    enabled: Boolean(purchaseId),
    staleTime: STALE_TIME.default,
  });
}
