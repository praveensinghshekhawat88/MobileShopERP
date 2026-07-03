import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { warrantyService } from '@/modules/warranty/services/warrantyService';
import type { CreateWarrantyRequest, WarrantyResponse } from '@/modules/warranty/types/Warranty';
import { showSuccessToast } from '@/utils/toast';

export function useCreateWarranty(): UseMutationResult<WarrantyResponse, unknown, CreateWarrantyRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateWarrantyRequest) => warrantyService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['warranties'] });
      showSuccessToast('Warranty created successfully.');
    },
  });
}

export function useSubmitWarrantyClaim(): UseMutationResult<WarrantyResponse, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => warrantyService.submitClaim(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['warranties'] });
      showSuccessToast('Warranty claim submitted successfully.');
    },
  });
}
