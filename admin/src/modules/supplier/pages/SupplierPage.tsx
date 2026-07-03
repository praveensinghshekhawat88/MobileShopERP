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
import { SupplierFormDialog } from '@/modules/supplier/components/SupplierFormDialog';
import { useDeleteSupplier } from '@/modules/supplier/hooks/useSupplierMutations';
import { useSuppliers } from '@/modules/supplier/hooks/useSuppliers';
import type { SupplierResponse } from '@/modules/supplier/types/Supplier';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { debounce } from '@/utils/debounce';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Supplier business record list — see 04_TASKS.md P05-T002. Unlike
 * Customer, every mutating action (create/update/delete) is
 * `hasRole('ADMIN')` only (see `SupplierController` role matrix); STAFF get
 * read-only list/search access. `DELETE` performs a soft delete
 * (`deleted_at`, see AGENTS.md § Soft Delete). Search matches the backend's
 * `supplierName`/`mobile` filters; `mobile` search takes priority over
 * `supplierName` when both are supplied (see `SupplierService#findAll`).
 */
export function SupplierPage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('supplierName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [nameInput, setNameInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [formSupplier, setFormSupplier] = useState<SupplierResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<SupplierResponse | null>(null);

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

  const suppliersQuery = useSuppliers({
    page,
    size: pageSize,
    supplierName: nameFilter || undefined,
    mobile: mobileFilter || undefined,
    sortKey,
    sortDirection,
  });
  const deleteSupplier = useDeleteSupplier();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteSupplier.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<SupplierResponse>[] = [
    {
      key: 'supplierName',
      header: 'Supplier Name',
      sortKey: 'supplierName',
      render: (row) => row.supplierName,
    },
    { key: 'contactPerson', header: 'Contact Person', render: (row) => row.contactPerson ?? '—' },
    { key: 'mobile', header: 'Mobile', render: (row) => row.mobile },
    { key: 'email', header: 'Email', render: (row) => row.email ?? '—' },
    { key: 'gstNumber', header: 'GST Number', render: (row) => row.gstNumber ?? '—' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: SupplierResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit supplier">
                  <IconButton size="small" onClick={() => setFormSupplier(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete supplier">
                  <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ),
          },
        ]
      : []),
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Suppliers' }]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Suppliers
        </Typography>
        {isAdmin ? (
          <AppButton
            appVariant="primary"
            startIcon={<AddIcon />}
            onClick={() => setFormSupplier(null)}
          >
            New Supplier
          </AppButton>
        ) : null}
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

      <DataTable<SupplierResponse>
        columns={columns}
        rows={suppliersQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={suppliersQuery.isLoading}
        error={suppliersQuery.isError ? getApiErrorMessage(suppliersQuery.error) : null}
        onRetry={() => void suppliersQuery.refetch()}
        emptyTitle="No suppliers found"
        emptyDescription={isAdmin ? 'Create your first supplier to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={suppliersQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formSupplier !== undefined ? (
        <SupplierFormDialog
          open
          supplier={formSupplier}
          onClose={() => setFormSupplier(undefined)}
        />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Supplier"
          message={`Are you sure you want to delete "${deleteTarget?.supplierName}"? This will remove them from the supplier list; historical purchases are preserved for referential integrity.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteSupplier.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
