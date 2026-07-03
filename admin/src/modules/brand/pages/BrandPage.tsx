import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { BrandFormDialog } from '@/modules/brand/components/BrandFormDialog';
import { useDeactivateBrand } from '@/modules/brand/hooks/useBrandMutations';
import { useBrands } from '@/modules/brand/hooks/useBrands';
import type { BrandResponse } from '@/modules/brand/types/Brand';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/**
 * Brand master list — see 04_TASKS.md P03-T001. Deactivate is a soft
 * action (`is_active = false`, see `BrandService#deactivate`); brands are
 * never hard-deleted since historical products/stock may still reference
 * them (see AGENTS.md § Soft Delete).
 */
export function BrandPage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [formBrand, setFormBrand] = useState<BrandResponse | null | undefined>(undefined);
  const [deactivateTarget, setDeactivateTarget] = useState<BrandResponse | null>(null);

  const brandsQuery = useBrands({ page, size: pageSize, sortKey, sortDirection });
  const deactivateBrand = useDeactivateBrand();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDeactivate = (): void => {
    if (!deactivateTarget) {
      return;
    }
    deactivateBrand.mutate(deactivateTarget.id, {
      onSuccess: () => setDeactivateTarget(null),
    });
  };

  const columns: readonly DataTableColumn<BrandResponse>[] = [
    { key: 'name', header: 'Name', sortKey: 'name', render: (row) => row.name },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description ?? '—',
    },
    {
      key: 'active',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.active ? 'Active' : 'Inactive'}
          color={row.active ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: BrandResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit brand">
                  <IconButton size="small" onClick={() => setFormBrand(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={row.active ? 'Deactivate brand' : 'Already inactive'}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={!row.active}
                      onClick={() => setDeactivateTarget(row)}
                    >
                      <ToggleOffOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            ),
          },
        ]
      : []),
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Brands' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Brands
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormBrand(null)}>
            New Brand
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<BrandResponse>
        columns={columns}
        rows={brandsQuery.data?.content ?? []}
        getRowId={(row) => String(row.id)}
        loading={brandsQuery.isLoading}
        error={brandsQuery.isError ? getApiErrorMessage(brandsQuery.error) : null}
        onRetry={() => void brandsQuery.refetch()}
        emptyTitle="No brands found"
        emptyDescription={isAdmin ? 'Create your first brand to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={brandsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formBrand !== undefined ? (
        <BrandFormDialog open brand={formBrand} onClose={() => setFormBrand(undefined)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deactivateTarget !== null}
          title="Deactivate Brand"
          message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will no longer be selectable for new products.`}
          confirmLabel="Deactivate"
          confirmVariant="danger"
          loading={deactivateBrand.isPending}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
