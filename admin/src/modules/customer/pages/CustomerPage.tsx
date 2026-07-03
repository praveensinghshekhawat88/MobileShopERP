import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useMemo, useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { CustomerFormDialog } from '@/modules/customer/components/CustomerFormDialog';
import { useDeleteCustomer } from '@/modules/customer/hooks/useCustomerMutations';
import { useCustomers } from '@/modules/customer/hooks/useCustomers';
import type { CustomerResponse } from '@/modules/customer/types/Customer';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { debounce } from '@/utils/debounce';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Customer business record list — see 04_TASKS.md P05-T001. There is no
 * dedicated `active`/`deactivate` flag on Customer (unlike Brand/Product) —
 * `DELETE` performs a soft delete (`deleted_at`, see AGENTS.md § Soft
 * Delete). Search matches the backend's `name`/`mobile` filters
 * (`CustomerController`); `mobile` search takes priority over `name` when
 * both are supplied (see `CustomerService#findAll`). Create/Edit are
 * available to ADMIN and STAFF; Delete is `hasRole('ADMIN')` only (see
 * `CustomerController` role matrix).
 */
export function CustomerPage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [nameInput, setNameInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [formCustomer, setFormCustomer] = useState<CustomerResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<CustomerResponse | null>(null);

  const applyNameFilter = useMemo(
    () =>
      debounce((value: string) => {
        setNameFilter(value);
        setPage(DEFAULT_PAGE_INDEX);
      }, SEARCH_DEBOUNCE_MS),
    []
  );
  const applyMobileFilter = useMemo(
    () =>
      debounce((value: string) => {
        setMobileFilter(value);
        setPage(DEFAULT_PAGE_INDEX);
      }, SEARCH_DEBOUNCE_MS),
    []
  );

  const customersQuery = useCustomers({
    page,
    size: pageSize,
    name: nameFilter || undefined,
    mobile: mobileFilter || undefined,
    sortKey,
    sortDirection,
  });
  const deleteCustomer = useDeleteCustomer();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteCustomer.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<CustomerResponse>[] = [
    { key: 'name', header: 'Name', sortKey: 'name', render: (row) => row.name },
    { key: 'mobile', header: 'Mobile', render: (row) => row.mobile },
    { key: 'email', header: 'Email', render: (row) => row.email ?? '—' },
    { key: 'gstNumber', header: 'GST Number', render: (row) => row.gstNumber ?? '—' },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: CustomerResponse) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Edit customer">
            <IconButton size="small" onClick={() => setFormCustomer(row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin ? (
            <Tooltip title="Delete customer">
              <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Customers' }]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Customers
        </Typography>
        <AppButton
          appVariant="primary"
          startIcon={<AddIcon />}
          onClick={() => setFormCustomer(null)}
        >
          New Customer
        </AppButton>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          size="small"
          label="Search by Name"
          sx={{ minWidth: 220 }}
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value);
            applyNameFilter(event.target.value.trim());
          }}
        />
        <TextField
          size="small"
          label="Search by Mobile"
          sx={{ minWidth: 220 }}
          value={mobileInput}
          onChange={(event) => {
            setMobileInput(event.target.value);
            applyMobileFilter(event.target.value.trim());
          }}
        />
      </Stack>

      <DataTable<CustomerResponse>
        columns={columns}
        rows={customersQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={customersQuery.isLoading}
        error={customersQuery.isError ? getApiErrorMessage(customersQuery.error) : null}
        onRetry={() => void customersQuery.refetch()}
        emptyTitle="No customers found"
        emptyDescription="Create your first customer to get started."
        page={page}
        pageSize={pageSize}
        totalCount={customersQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {formCustomer !== undefined ? (
        <CustomerFormDialog
          open
          customer={formCustomer}
          onClose={() => setFormCustomer(undefined)}
        />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Customer"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove them from the customer list; historical sales/repairs are preserved for referential integrity.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteCustomer.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
