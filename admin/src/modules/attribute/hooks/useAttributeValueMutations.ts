import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { attributeValueService } from '@/modules/attribute/services/attributeValueService';
import type {
  AttributeValueResponse,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
} from '@/modules/attribute/types/Attribute';
import { showSuccessToast } from '@/utils/toast';

function invalidateAttributeValueQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['attribute-values'] });
}

export function useCreateAttributeValue(): UseMutationResult<
  AttributeValueResponse,
  unknown,
  CreateAttributeValueRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAttributeValueRequest) => attributeValueService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeValueQueries(queryClient);
      showSuccessToast('Attribute value created successfully.');
    },
  });
}

export function useUpdateAttributeValue(): UseMutationResult<
  AttributeValueResponse,
  unknown,
  { readonly id: number; readonly request: UpdateAttributeValueRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => attributeValueService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateAttributeValueQueries(queryClient);
      showSuccessToast('Attribute value updated successfully.');
    },
  });
}

export function useDeactivateAttributeValue(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => attributeValueService.deactivate(id),
    onSuccess: () => {
      invalidateAttributeValueQueries(queryClient);
      showSuccessToast('Attribute value deactivated successfully.');
    },
  });
}
