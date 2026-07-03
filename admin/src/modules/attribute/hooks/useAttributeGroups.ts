import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { attributeGroupService } from '@/modules/attribute/services/attributeGroupService';
import type { AttributeGroupResponse } from '@/modules/attribute/types/Attribute';
import type { Page } from '@/types/Page';

interface UseAttributeGroupsParams {
  readonly page: number;
  readonly size: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useAttributeGroups({
  page,
  size,
  sortKey,
  sortDirection,
}: UseAttributeGroupsParams): UseQueryResult<Page<AttributeGroupResponse>> {
  return useQuery({
    queryKey: ['attribute-groups', 'list', page, size, sortKey, sortDirection],
    queryFn: () => attributeGroupService.list({ page, size, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Attribute-group scale is small (master data) — a single large page backs every group picker/filter. */
const OPTIONS_PAGE_SIZE = 200;

interface AttributeGroupOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<number, string>;
  readonly isLoading: boolean;
}

export function useAttributeGroupOptions(): AttributeGroupOptionsResult {
  const query = useQuery({
    queryKey: ['attribute-groups', 'options'],
    queryFn: () =>
      attributeGroupService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'name', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const groups = query.data?.content ?? [];
  return {
    options: groups.map((group) => ({ value: String(group.id), label: group.name })),
    nameById: new Map(groups.map((group) => [group.id, group.name])),
    isLoading: query.isLoading,
  };
}
