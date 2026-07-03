import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { settingsService } from '@/modules/settings/services/settingsService';
import type { SettingsResponse, UpdateSettingsRequest } from '@/modules/settings/types/Settings';
import { showSuccessToast } from '@/utils/toast';

export function useApplicationSettings(): UseQueryResult<SettingsResponse> {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get(),
    staleTime: STALE_TIME.settings,
  });
}

export function useUpdateApplicationSettings(): UseMutationResult<
  SettingsResponse,
  unknown,
  UpdateSettingsRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateSettingsRequest) => settingsService.update(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      showSuccessToast('Shop settings updated successfully.');
    },
  });
}
