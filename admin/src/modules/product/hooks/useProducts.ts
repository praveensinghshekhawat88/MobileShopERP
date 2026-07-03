import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { productService } from '@/modules/product/services/productService';
import type { ProductResponse } from '@/modules/product/types/Product';
import type { Page } from '@/types/Page';

interface UseProductsParams {
  readonly page: number;
  readonly size: number;
  readonly brandId?: number;
  readonly categoryId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useProducts({
  page,
  size,
  brandId,
  categoryId,
  sortKey,
  sortDirection,
}: UseProductsParams): UseQueryResult<Page<ProductResponse>> {
  return useQuery({
    queryKey: ['products', 'list', page, size, brandId, categoryId, sortKey, sortDirection],
    queryFn: () => productService.list({ page, size, brandId, categoryId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Single product fetch — backs the Product detail screen header. */
export function useProduct(productId: string | undefined): UseQueryResult<ProductResponse> {
  return useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => productService.getById(productId as string),
    enabled: Boolean(productId),
    staleTime: STALE_TIME.default,
  });
}
