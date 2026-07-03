import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import { STALE_TIME } from '@/config/queryClient';
import { roleService } from '@/modules/role/services/roleService';
import type { RoleResponse } from '@/modules/role/types/Role';

interface RoleOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly roleById: ReadonlyMap<number, RoleResponse>;
  readonly isLoading: boolean;
}

export function useRoles(): UseQueryResult<readonly RoleResponse[]> {
  return useQuery({
    queryKey: ['roles', 'list'],
    queryFn: () => roleService.listActive(),
    staleTime: STALE_TIME.default,
  });
}

export function useRoleOptions(): RoleOptionsResult {
  const query = useRoles();
  const roles = query.data ?? [];

  return {
    options: roles.map((role) => ({ value: String(role.id), label: role.name })),
    roleById: new Map(roles.map((role) => [role.id, role])),
    isLoading: query.isLoading,
  };
}
