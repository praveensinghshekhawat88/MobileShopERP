import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { productPriceService } from '@/modules/product/services/productPriceService';
import type { CreateProductPriceRequest, ProductPriceResponse } from '@/modules/product/types/Product';
import { showSuccessToast } from '@/utils/toast';

/**
 * Append-only — see AGENTS.md § Product Price Rule. Creating a new active
 * RETAIL price auto-closes the previous one server-side, so the price-history
 * query is always invalidated (never just appended to client-side) to reflect
 * that change.
 */
export function useCreateProductPrice(
  variantId: string
): UseMutationResult<ProductPriceResponse, unknown, CreateProductPriceRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductPriceRequest) => productPriceService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['product-prices', variantId] });
      showSuccessToast('Price added successfully.');
    },
  });
}
