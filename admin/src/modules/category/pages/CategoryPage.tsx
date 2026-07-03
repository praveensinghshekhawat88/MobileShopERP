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
import { CategoryFormDialog } from '@/modules/category/components/CategoryFormDialog';
import { useCategories } from '@/modules/category/hooks/useCategories';
import { useDeactivateCategory } from '@/modules/category/hooks/useCategoryMutations';
import { useCategoryOptions } from '@/modules/category/hooks/useCategoryOptions';
import type { CategoryResponse } from '@/modules/category/types/Category';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/**
 * Category master list — see 04_TASKS.md P03-T002 and AGENTS.md § Category
 * Rule (self-referencing, never a separate `sub_categories` table). The
 * table shows the flat, paginated `GET /categories` response; "Parent" is
 * resolved via the active category tree (see `useCategoryOptions`) since
 * the flat response only carries `parentId`.
 */
export function CategoryPage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [formCategory, setFormCategory] = useState<CategoryResponse | null | undefined>(undefined);
  const [deactivateTarget, setDeactivateTarget] = useState<CategoryResponse | null>(null);

  const categoriesQuery = useCategories({ page, size: pageSize, sortKey, sortDirection });
  const { nameById: parentNameById } = useCategoryOptions();
  const deactivateCategory = useDeactivateCategory();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDeactivate = (): void => {
    if (!deactivateTarget) {
      return;
    }
    deactivateCategory.mutate(deactivateTarget.id, {
      onSuccess: () => setDeactivateTarget(null),
    });
  };

  const columns: readonly DataTableColumn<CategoryResponse>[] = [
    { key: 'name', header: 'Name', sortKey: 'name', render: (row) => row.name },
    {
      key: 'parent',
      header: 'Parent Category',
      render: (row) => (row.parentId !== null ? (parentNameById.get(row.parentId) ?? '—') : '—'),
    },
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
            render: (row: CategoryResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit category">
                  <IconButton size="small" onClick={() => setFormCategory(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={row.active ? 'Deactivate category' : 'Already inactive'}>
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
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Categories' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Categories
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormCategory(null)}>
            New Category
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<CategoryResponse>
        columns={columns}
        rows={categoriesQuery.data?.content ?? []}
        getRowId={(row) => String(row.id)}
        loading={categoriesQuery.isLoading}
        error={categoriesQuery.isError ? getApiErrorMessage(categoriesQuery.error) : null}
        onRetry={() => void categoriesQuery.refetch()}
        emptyTitle="No categories found"
        emptyDescription={isAdmin ? 'Create your first category to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={categoriesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formCategory !== undefined ? (
        <CategoryFormDialog open category={formCategory} onClose={() => setFormCategory(undefined)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deactivateTarget !== null}
          title="Deactivate Category"
          message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? Its child categories will remain but this category will no longer be selectable for new products.`}
          confirmLabel="Deactivate"
          confirmVariant="danger"
          loading={deactivateCategory.isPending}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
