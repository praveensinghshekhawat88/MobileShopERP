import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { productPriceService } from '@/modules/product/services/productPriceService';
import type { ProductPriceResponse } from '@/modules/product/types/Product';

/** Full price history for a variant, ordered by the backend as `effectiveFrom DESC, createdAt DESC`. */
export function useProductPrices(variantId: string | undefined): UseQueryResult<readonly ProductPriceResponse[]> {
  return useQuery({
    queryKey: ['product-prices', variantId],
    queryFn: () => productPriceService.listByVariant(variantId as string),
    enabled: Boolean(variantId),
    staleTime: STALE_TIME.default,
  });
}
