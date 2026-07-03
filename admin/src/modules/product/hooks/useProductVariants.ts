import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { productVariantService } from '@/modules/product/services/productVariantService';
import type { ProductVariantResponse } from '@/modules/product/types/Product';
import type { Page } from '@/types/Page';

interface UseProductVariantsParams {
  readonly page: number;
  readonly size: number;
  readonly productId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useProductVariants({
  page,
  size,
  productId,
  sortKey,
  sortDirection,
}: UseProductVariantsParams): UseQueryResult<Page<ProductVariantResponse>> {
  return useQuery({
    queryKey: ['product-variants', 'list', page, size, productId, sortKey, sortDirection],
    queryFn: () => productVariantService.list({ page, size, productId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Single variant fetch — backs the Variant detail screen header. */
export function useProductVariant(variantId: string | undefined): UseQueryResult<ProductVariantResponse> {
  return useQuery({
    queryKey: ['product-variants', 'detail', variantId],
    queryFn: () => productVariantService.getById(variantId as string),
    enabled: Boolean(variantId),
    staleTime: STALE_TIME.default,
  });
}

const OPTIONS_PAGE_SIZE = 500;

interface ProductVariantOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly skuById: ReadonlyMap<string, string>;
  readonly isLoading: boolean;
}

/** Active variants for the Purchase module's variant picker (labelled by SKU). */
export function useProductVariantOptions(): ProductVariantOptionsResult {
  const query = useQuery({
    queryKey: ['product-variants', 'options'],
    queryFn: () =>
      productVariantService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'sku', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const variants = query.data?.content ?? [];
  return {
    options: variants.map((variant) => ({ value: variant.id, label: variant.sku })),
    skuById: new Map(variants.map((variant) => [variant.id, variant.sku])),
    isLoading: query.isLoading,
  };
}
