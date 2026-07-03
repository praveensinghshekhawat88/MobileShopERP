import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { productImageService } from '@/modules/product/services/productImageService';
import type { ProductImageResponse } from '@/modules/product/types/Product';

/** Images for a single variant, ordered by the backend as `displayOrder ASC, createdAt ASC`. */
export function useProductImages(variantId: string | undefined): UseQueryResult<readonly ProductImageResponse[]> {
  return useQuery({
    queryKey: ['product-images', variantId],
    queryFn: () => productImageService.listByVariant(variantId as string),
    enabled: Boolean(variantId),
    staleTime: STALE_TIME.default,
  });
}
