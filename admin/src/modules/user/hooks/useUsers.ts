import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { userService } from '@/modules/user/services/userService';
import type { UserResponse } from '@/modules/user/types/User';
import type { Page } from '@/types/Page';

interface UseUsersParams {
  readonly page: number;
  readonly size: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useUsers({
  page,
  size,
  sortKey,
  sortDirection,
}: UseUsersParams): UseQueryResult<Page<UserResponse>> {
  return useQuery({
    queryKey: ['users', 'list', page, size, sortKey, sortDirection],
    queryFn: () => userService.list({ page, size, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useUser(userId: string | undefined): UseQueryResult<UserResponse> {
  return useQuery({
    queryKey: ['users', 'detail', userId],
    queryFn: () => userService.getById(userId as string),
    enabled: Boolean(userId),
    staleTime: STALE_TIME.default,
  });
}
