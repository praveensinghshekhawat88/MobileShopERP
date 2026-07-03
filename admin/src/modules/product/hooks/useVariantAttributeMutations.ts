import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { variantAttributeService } from '@/modules/product/services/variantAttributeService';
import type { CreateVariantAttributeRequest, VariantAttributeDetailResponse } from '@/modules/product/types/Product';
import { showSuccessToast } from '@/utils/toast';

export function useAssignVariantAttribute(
  variantId: string
): UseMutationResult<VariantAttributeDetailResponse, unknown, CreateVariantAttributeRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateVariantAttributeRequest) => variantAttributeService.assign(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['variant-attributes', variantId] });
      showSuccessToast('Attribute value assigned successfully.');
    },
  });
}

/** Hard delete (see `ProductVariantAttributeService#remove`) — the calling page must confirm first. */
export function useRemoveVariantAttribute(variantId: string): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => variantAttributeService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['variant-attributes', variantId] });
      showSuccessToast('Attribute value removed successfully.');
    },
  });
}
