import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { FormSelectOption } from '@/components/inputs/FormSelect';
import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { customerService } from '@/modules/customer/services/customerService';
import type { CustomerResponse } from '@/modules/customer/types/Customer';
import type { Page } from '@/types/Page';

interface UseCustomersParams {
  readonly page: number;
  readonly size: number;
  readonly name?: string;
  readonly mobile?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useCustomers({
  page,
  size,
  name,
  mobile,
  sortKey,
  sortDirection,
}: UseCustomersParams): UseQueryResult<Page<CustomerResponse>> {
  return useQuery({
    queryKey: ['customers', 'list', page, size, name, mobile, sortKey, sortDirection],
    queryFn: () => customerService.list({ page, size, name, mobile, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

/** Single customer fetch — reserved for future modules (Sales/Repairs) that need a customer by id. */
export function useCustomer(customerId: string | undefined): UseQueryResult<CustomerResponse> {
  return useQuery({
    queryKey: ['customers', 'detail', customerId],
    queryFn: () => customerService.getById(customerId as string),
    enabled: Boolean(customerId),
    staleTime: STALE_TIME.default,
  });
}

const OPTIONS_PAGE_SIZE = 200;

interface CustomerOptionsResult {
  readonly options: readonly FormSelectOption[];
  readonly nameById: ReadonlyMap<string, string>;
  readonly isLoading: boolean;
}

/** Active customers for the Sales module's customer picker/filter. */
export function useCustomerOptions(): CustomerOptionsResult {
  const query = useQuery({
    queryKey: ['customers', 'options'],
    queryFn: () => customerService.list({ page: 0, size: OPTIONS_PAGE_SIZE, sortKey: 'name', sortDirection: 'asc' }),
    staleTime: STALE_TIME.default,
  });

  const customers = query.data?.content ?? [];
  return {
    options: customers.map((customer) => ({ value: customer.id, label: customer.name })),
    nameById: new Map(customers.map((customer) => [customer.id, customer.name])),
    isLoading: query.isLoading,
  };
}
