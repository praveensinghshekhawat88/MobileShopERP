import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { repairService } from '@/modules/repair/services/repairService';
import type {
  CreateRepairRequest,
  RepairResponse,
  UpdateRepairRequest,
  UpdateRepairStatusRequest,
} from '@/modules/repair/types/Repair';
import { showSuccessToast } from '@/utils/toast';

function invalidateRepairQueries(queryClient: ReturnType<typeof useQueryClient>, repairId?: string): void {
  void queryClient.invalidateQueries({ queryKey: ['repairs'] });
  void queryClient.invalidateQueries({ queryKey: ['stock'] });
  if (repairId) {
    void queryClient.invalidateQueries({ queryKey: ['payments'] });
  }
}

export function useCreateRepair(): UseMutationResult<RepairResponse, unknown, CreateRepairRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRepairRequest) => repairService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateRepairQueries(queryClient);
      showSuccessToast('Repair ticket created successfully.');
    },
  });
}

export function useUpdateRepair(): UseMutationResult<
  RepairResponse,
  unknown,
  { readonly id: string; readonly request: UpdateRepairRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => repairService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { id }) => {
      invalidateRepairQueries(queryClient, id);
      showSuccessToast('Repair updated successfully.');
    },
  });
}

export function useUpdateRepairStatus(): UseMutationResult<
  RepairResponse,
  unknown,
  { readonly id: string; readonly request: UpdateRepairStatusRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => repairService.updateStatus(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { id }) => {
      invalidateRepairQueries(queryClient, id);
      showSuccessToast('Repair status updated successfully.');
    },
  });
}
