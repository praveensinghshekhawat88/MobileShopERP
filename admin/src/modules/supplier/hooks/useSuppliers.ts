import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { supplierService } from '@/modules/supplier/services/supplierService';
import type { SupplierResponse } from '@/modules/supplier/types/Supplier';
import type { Page } from '@/types/Page';

interface UseSuppliersParams {
  readonly page: number;
  readonly size: number;
  readonly supplierName?: string;
  readonly mobile?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useSuppliers({
  page,
  size,
  supplierName,
  mobile,
  sortKey,
  sortDirection,
}: UseSuppliersParams): UseQueryResult<Page<SupplierResponse>> {
  return useQuery({
    queryKey: ['suppliers', 'list', page, size, supplierName, mobile, sortKey, sortDirection],
    queryFn: () =>
      supplierService.list({ page, size, supplierName, mobile, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Single supplier fetch — reserved for future modules (Purchase) that need a supplier by id. */
export function useSupplier(supplierId: string | undefined): UseQueryResult<SupplierResponse> {
  return useQuery({
    queryKey: ['suppliers', 'detail', supplierId],
    queryFn: () => supplierService.getById(supplierId as string),
    enabled: Boolean(supplierId),
    staleTime: STALE_TIME.default,
  });
}

const OPTIONS_PAGE_SIZE = 200;

interface SupplierOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<string, string>;
  readonly isLoading: boolean;
}

/** Active suppliers for the Purchase module's supplier picker/filter. */
export function useSupplierOptions(): SupplierOptionsResult {
  const query = useQuery({
    queryKey: ['suppliers', 'options'],
    queryFn: () =>
      supplierService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'supplierName', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const suppliers = query.data?.content ?? [];
  return {
    options: suppliers.map((supplier) => ({ value: supplier.id, label: supplier.supplierName })),
    nameById: new Map(suppliers.map((supplier) => [supplier.id, supplier.supplierName])),
    isLoading: query.isLoading,
  };
}
