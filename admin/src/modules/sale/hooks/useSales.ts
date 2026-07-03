import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { MOVEMENT_TYPES } from '@/common/constants/movementType';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { stockMovementService } from '@/modules/inventory/services/stockMovementService';
import { saleService } from '@/modules/sale/services/saleService';
import type { SaleResponse } from '@/modules/sale/types/Sale';
import type { Page } from '@/types/Page';

interface UseSalesParams {
  readonly page: number;
  readonly size: number;
  readonly customerId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useSales({
  page,
  size,
  customerId,
  sortKey,
  sortDirection,
}: UseSalesParams): UseQueryResult<Page<SaleResponse>> {
  return useQuery({
    queryKey: ['sales', 'list', page, size, customerId, sortKey, sortDirection],
    queryFn: () => saleService.list({ page, size, customerId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useSale(saleId: string | undefined): UseQueryResult<SaleResponse> {
  return useQuery({
    queryKey: ['sales', 'detail', saleId],
    queryFn: () => saleService.getById(saleId as string),
    enabled: Boolean(saleId),
    staleTime: STALE_TIME.default,
  });
}

/**
 * Derives whether a sale has been finalized — no `SaleStatus` enum exists;
 * finalized sales have SALE stock movements (see `SaleCompletionService#finalizeSale`).
 */
export function useSaleFinalized(saleId: string | undefined): UseQueryResult<boolean> {
  return useQuery({
    queryKey: ['sales', 'finalized', saleId],
    queryFn: async () => {
      const page = await stockMovementService.list({
        page: 0,
        size: 1,
        referenceType: REFERENCE_TYPES.SALE,
        referenceId: saleId as string,
      });
      return page.content.some((movement) => movement.movementType === MOVEMENT_TYPES.SALE);
    },
    enabled: Boolean(saleId),
    staleTime: STALE_TIME.default,
  });
}

const SALE_OPTIONS_PAGE_SIZE = 500;

interface SaleOptionsResult {
  readonly options: readonly { value: string; label: string }[];
  readonly invoiceById: ReadonlyMap<string, string>;
  readonly isLoading: boolean;
}

/** Recent sales for pickers (e.g. Warranty module). */
export function useSaleOptions(): SaleOptionsResult {
  const query = useQuery({
    queryKey: ['sales', 'options'],
    queryFn: () =>
      saleService.list({ page: 0, size: SALE_OPTIONS_PAGE_SIZE, sortKey: 'invoiceDate', sortDirection: 'desc' }),
    staleTime: STALE_TIME.default,
  });

  const sales = query.data?.content ?? [];
  return {
    options: sales.map((sale) => ({ value: sale.id, label: sale.invoiceNumber })),
    invoiceById: new Map(sales.map((sale) => [sale.id, sale.invoiceNumber])),
    isLoading: query.isLoading,
  };
}
