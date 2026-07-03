import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STOCK_STATUSES, type StockStatus } from '@/common/constants/stockStatus';
import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { stockService } from '@/modules/inventory/services/stockService';
import type { StockResponse } from '@/modules/inventory/types/Stock';
import type { Page } from '@/types/Page';

interface UseStockListParams {
  readonly page: number;
  readonly size: number;
  readonly variantId?: string;
  readonly status?: StockStatus;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useStockList({
  page,
  size,
  variantId,
  status,
  sortKey,
  sortDirection,
}: UseStockListParams): UseQueryResult<Page<StockResponse>> {
  return useQuery({
    queryKey: ['stock', 'list', page, size, variantId, status, sortKey, sortDirection],
    queryFn: () => stockService.list({ page, size, variantId, status, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useStock(stockId: string | undefined): UseQueryResult<StockResponse> {
  return useQuery({
    queryKey: ['stock', 'detail', stockId],
    queryFn: () => stockService.getById(stockId as string),
    enabled: Boolean(stockId),
    staleTime: STALE_TIME.default,
  });
}

const SALABLE_STATUSES: readonly StockStatus[] = [STOCK_STATUSES.AVAILABLE, STOCK_STATUSES.RESERVED];
const OPTIONS_PAGE_SIZE = 500;

interface AvailableStockOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly stockById: ReadonlyMap<string, StockResponse>;
  readonly isLoading: boolean;
}

/** Salable stock (AVAILABLE/RESERVED) for the Sales module's stock picker. */
export function useAvailableStockOptions(): AvailableStockOptionsResult {
  const query = useQuery({
    queryKey: ['stock', 'salable-options'],
    queryFn: () => stockService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'createdAt', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const salable = (query.data?.content ?? []).filter((stock) => SALABLE_STATUSES.includes(stock.stockStatus));
  return {
    options: salable.map((stock) => ({
      value: stock.id,
      label: stock.imei ? stock.imei : `Stock ${stock.id.slice(0, 8)}…`,
    })),
    stockById: new Map(salable.map((stock) => [stock.id, stock])),
    isLoading: query.isLoading,
  };
}

const REPAIR_ELIGIBLE_STATUSES: readonly StockStatus[] = [
  STOCK_STATUSES.AVAILABLE,
  STOCK_STATUSES.SOLD,
  STOCK_STATUSES.REPAIR,
];

/** Stock eligible for repair tickets (AVAILABLE/SOLD/REPAIR) — see `RepairService#create`. */
export function useRepairStockOptions(): AvailableStockOptionsResult {
  const query = useQuery({
    queryKey: ['stock', 'repair-options'],
    queryFn: () => stockService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'createdAt', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const eligible = (query.data?.content ?? []).filter((stock) =>
    REPAIR_ELIGIBLE_STATUSES.includes(stock.stockStatus)
  );
  return {
    options: eligible.map((stock) => ({
      value: stock.id,
      label: stock.imei ? stock.imei : `Stock ${stock.id.slice(0, 8)}…`,
    })),
    stockById: new Map(eligible.map((stock) => [stock.id, stock])),
    isLoading: query.isLoading,
  };
}
