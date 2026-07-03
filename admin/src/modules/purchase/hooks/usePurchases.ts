import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { stockMovementService } from '@/modules/inventory/services/stockMovementService';
import { purchaseService } from '@/modules/purchase/services/purchaseService';
import type { PurchaseResponse } from '@/modules/purchase/types/Purchase';
import type { Page } from '@/types/Page';

interface UsePurchasesParams {
  readonly page: number;
  readonly size: number;
  readonly supplierId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function usePurchases({
  page,
  size,
  supplierId,
  sortKey,
  sortDirection,
}: UsePurchasesParams): UseQueryResult<Page<PurchaseResponse>> {
  return useQuery({
    queryKey: ['purchases', 'list', page, size, supplierId, sortKey, sortDirection],
    queryFn: () => purchaseService.list({ page, size, supplierId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function usePurchase(purchaseId: string | undefined): UseQueryResult<PurchaseResponse> {
  return useQuery({
    queryKey: ['purchases', 'detail', purchaseId],
    queryFn: () => purchaseService.getById(purchaseId as string),
    enabled: Boolean(purchaseId),
    staleTime: STALE_TIME.default,
  });
}

/**
 * Derives whether a purchase has been received — the backend exposes no
 * `received` flag on `PurchaseResponse`, so we infer it from PURCHASE
 * stock-movement records (see `PurchaseReceiveService#receive`).
 */
export function usePurchaseReceived(purchaseId: string | undefined): UseQueryResult<boolean> {
  return useQuery({
    queryKey: ['purchases', 'received', purchaseId],
    queryFn: async () => {
      const page = await stockMovementService.list({
        page: 0,
        size: 1,
        referenceType: REFERENCE_TYPES.PURCHASE,
        referenceId: purchaseId as string,
      });
      return page.totalElements > 0;
    },
    enabled: Boolean(purchaseId),
    staleTime: STALE_TIME.default,
  });
}
