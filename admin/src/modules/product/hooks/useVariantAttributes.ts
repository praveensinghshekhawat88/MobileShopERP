import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { variantAttributeService } from '@/modules/product/services/variantAttributeService';
import type { VariantAttributeDetailResponse } from '@/modules/product/types/Product';

/** Attribute values currently assigned to a variant, ordered by the backend as `createdAt ASC`. */
export function useVariantAttributes(
  variantId: string | undefined
): UseQueryResult<readonly VariantAttributeDetailResponse[]> {
  return useQuery({
    queryKey: ['variant-attributes', variantId],
    queryFn: () => variantAttributeService.listByVariant(variantId as string),
    enabled: Boolean(variantId),
    staleTime: STALE_TIME.default,
  });
}
