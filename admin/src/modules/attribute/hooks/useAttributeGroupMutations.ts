import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { attributeGroupService } from '@/modules/attribute/services/attributeGroupService';
import type {
  AttributeGroupResponse,
  CreateAttributeGroupRequest,
  UpdateAttributeGroupRequest,
} from '@/modules/attribute/types/Attribute';
import { showSuccessToast } from '@/utils/toast';

function invalidateAttributeGroupQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['attribute-groups'] });
}

export function useCreateAttributeGroup(): UseMutationResult<
  AttributeGroupResponse,
  unknown,
  CreateAttributeGroupRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAttributeGroupRequest) => attributeGroupService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeGroupQueries(queryClient);
      showSuccessToast('Attribute group created successfully.');
    },
  });
}

export function useUpdateAttributeGroup(): UseMutationResult<
  AttributeGroupResponse,
  unknown,
  { readonly id: number; readonly request: UpdateAttributeGroupRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => attributeGroupService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeGroupQueries(queryClient);
      showSuccessToast('Attribute group updated successfully.');
    },
  });
}

/** Hard delete (see `AttributeGroupService#delete`) — the calling page must confirm first. */
export function useDeleteAttributeGroup(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => attributeGroupService.remove(id),
    onSuccess: () => {
      invalidateAttributeGroupQueries(queryClient);
      showSuccessToast('Attribute group deleted successfully.');
    },
  });
}
