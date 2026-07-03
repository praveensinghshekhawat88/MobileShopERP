import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { attributeService } from '@/modules/attribute/services/attributeService';
import type {
  AttributeResponse,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from '@/modules/attribute/types/Attribute';
import { showSuccessToast } from '@/utils/toast';

function invalidateAttributeQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['attributes'] });
}

export function useCreateAttribute(): UseMutationResult<AttributeResponse, unknown, CreateAttributeRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAttributeRequest) => attributeService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeQueries(queryClient);
      showSuccessToast('Attribute created successfully.');
    },
  });
}

export function useUpdateAttribute(): UseMutationResult<
  AttributeResponse,
  unknown,
  { readonly id: number; readonly request: UpdateAttributeRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => attributeService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeQueries(queryClient);
      showSuccessToast('Attribute updated successfully.');
    },
  });
}

/** Hard delete (see `AttributeService#delete`) — the calling page must confirm first. */
export function useDeleteAttribute(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => attributeService.remove(id),
    onSuccess: () => {
      invalidateAttributeQueries(queryClient);
      showSuccessToast('Attribute deleted successfully.');
    },
  });
}
