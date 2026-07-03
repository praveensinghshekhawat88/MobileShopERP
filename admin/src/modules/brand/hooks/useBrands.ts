import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { brandService } from '@/modules/brand/services/brandService';
import type { BrandResponse } from '@/modules/brand/types/Brand';
import type { Page } from '@/types/Page';

interface UseBrandsParams {
  readonly page: number;
  readonly size: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useBrands({
  page,
  size,
  sortKey,
  sortDirection,
}: UseBrandsParams): UseQueryResult<Page<BrandResponse>> {
  return useQuery({
    queryKey: ['brands', 'list', page, size, sortKey, sortDirection],
    queryFn: () => brandService.list({ page, size, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Brand scale is small (master data) — a single large page backs the Product brand picker/filter. */
const OPTIONS_PAGE_SIZE = 200;

interface BrandOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<number, string>;
  readonly isLoading: boolean;
}

/** Active brands only (see `BrandController#findAllActive`) — used by the Product module's brand picker/filter. */
export function useBrandOptions(): BrandOptionsResult {
  const query = useQuery({
    queryKey: ['brands', 'options'],
    queryFn: () => brandService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'name', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const brands = query.data?.content ?? [];
  return {
    options: brands.map((brand) => ({ value: String(brand.id), label: brand.name })),
    nameById: new Map(brands.map((brand) => [brand.id, brand.name])),
    isLoading: query.isLoading,
  };
}
