import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { customerService } from '@/modules/customer/services/customerService';
import type {
  CreateCustomerRequest,
  CustomerResponse,
  UpdateCustomerRequest,
} from '@/modules/customer/types/Customer';
import { showSuccessToast } from '@/utils/toast';

function invalidateCustomerQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['customers'] });
}

export function useCreateCustomer(): UseMutationResult<
  CustomerResponse,
  unknown,
  CreateCustomerRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCustomerRequest) => customerService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateCustomerQueries(queryClient);
      showSuccessToast('Customer created successfully.');
    },
  });
}

export function useUpdateCustomer(): UseMutationResult<
  CustomerResponse,
  unknown,
  { readonly id: string; readonly request: UpdateCustomerRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => customerService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateCustomerQueries(queryClient);
      showSuccessToast('Customer updated successfully.');
    },
  });
}

/** Soft delete (see `CustomerService#softDelete`) — the calling page must confirm first; ADMIN only. */
export function useDeleteCustomer(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.remove(id),
    onSuccess: () => {
      invalidateCustomerQueries(queryClient);
      showSuccessToast('Customer deleted successfully.');
    },
  });
}
