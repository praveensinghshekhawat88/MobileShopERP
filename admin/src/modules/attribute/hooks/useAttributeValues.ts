import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { attributeValueService } from '@/modules/attribute/services/attributeValueService';
import type { AttributeValueResponse } from '@/modules/attribute/types/Attribute';
import type { Page } from '@/types/Page';

interface UseAttributeValuesParams {
  readonly page: number;
  readonly size: number;
  readonly attributeId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useAttributeValues({
  page,
  size,
  attributeId,
  sortKey,
  sortDirection,
}: UseAttributeValuesParams): UseQueryResult<Page<AttributeValueResponse>> {
  return useQuery({
    queryKey: ['attribute-values', 'list', page, size, attributeId, sortKey, sortDirection],
    queryFn: () => attributeValueService.list({ page, size, attributeId, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Attribute-value scale per attribute is small (master data) — a single large page backs the value picker. */
const OPTIONS_PAGE_SIZE = 500;

interface AttributeValueOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly isLoading: boolean;
}

/**
 * Active attribute values for a single attribute, as `FormSelect` options —
 * used by the Product module's "Assign Attribute Value" picker (see
 * AGENTS.md § Attribute Engine). Returns no options until `attributeId` is
 * chosen (an attribute value cannot be assigned without a parent attribute).
 */
export function useAttributeValueOptions(attributeId?: number): AttributeValueOptionsResult {
  const query = useQuery({
    queryKey: ['attribute-values', 'options', attributeId],
    queryFn: () =>
      attributeValueService.list({
        page: 0,
        size: OPTIONS_PAGE_SIZE,
        attributeId,
        sortKey: 'displayOrder',
        sortDirection: 'asc',
      }),
    enabled: attributeId !== undefined,
    staleTime: STALE_TIME.default,
  });

  const values = (query.data?.content ?? []).filter((value) => value.active);
  return {
    options: values.map((value) => ({ value: String(value.id), label: value.value })),
    isLoading: query.isLoading,
  };
}
