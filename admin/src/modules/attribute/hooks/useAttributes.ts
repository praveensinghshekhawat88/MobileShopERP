import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { attributeService } from '@/modules/attribute/services/attributeService';
import type { AttributeResponse } from '@/modules/attribute/types/Attribute';
import type { Page } from '@/types/Page';

interface UseAttributesParams {
  readonly page: number;
  readonly size: number;
  readonly attributeGroupId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useAttributes({
  page,
  size,
  attributeGroupId,
  sortKey,
  sortDirection,
}: UseAttributesParams): UseQueryResult<Page<AttributeResponse>> {
  return useQuery({
    queryKey: ['attributes', 'list', page, size, attributeGroupId, sortKey, sortDirection],
    queryFn: () => attributeService.list({ page, size, attributeGroupId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Attribute scale is small (master data) — a single large page backs the value picker/filter. */
const OPTIONS_PAGE_SIZE = 500;

interface AttributeOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<number, string>;
  readonly isLoading: boolean;
}

export function useAttributeOptions(attributeGroupId?: number): AttributeOptionsResult {
  const query = useQuery({
    queryKey: ['attributes', 'options', attributeGroupId],
    queryFn: () =>
      attributeService.list({
        page: 0,
        size: OPTIONS_PAGE_SIZE,
        attributeGroupId,
        sortKey: 'name',
        sortDirection: 'asc',
      }),
    staleTime: STALE_TIME.default,
  });

  const attributes = query.data?.content ?? [];
  return {
    options: attributes.map((attribute) => ({ value: String(attribute.id), label: attribute.name })),
    nameById: new Map(attributes.map((attribute) => [attribute.id, attribute.name])),
    isLoading: query.isLoading,
  };
}
