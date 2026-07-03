import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import {
  Chip,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type JSX } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { useBrandOptions } from '@/modules/brand';
import { useCategoryOptions } from '@/modules/category';
import { ProductFormDialog } from '@/modules/product/components/ProductFormDialog';
import { useDeactivateProduct, useDeleteProduct } from '@/modules/product/hooks/useProductMutations';
import { useProducts } from '@/modules/product/hooks/useProducts';
import type { ProductResponse } from '@/modules/product/types/Product';
import { buildProductDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/**
 * Product master list — see 04_TASKS.md P04-T001 and AGENTS.md § Product
 * Structure: "Brand → Category → Product → Variant → Attributes → Prices →
 * Stock." The backend exposes no free-text search on `GET /products` (only
 * `brandId`/`categoryId` filters — see BACKEND_API_CONTRACT.md), so those two
 * filters stand in for search, matching the Phase 03 Brand/Category screens.
 */
export function ProductPage(): JSX.Element {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formProduct, setFormProduct] = useState<ProductResponse | null | undefined>(undefined);
  const [deactivateTarget, setDeactivateTarget] = useState<ProductResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductResponse | null>(null);

  const { options: brandOptions, nameById: brandNameById } = useBrandOptions();
  const { options: categoryOptions, nameById: categoryNameById } = useCategoryOptions();
  const productsQuery = useProducts({
    page,
    size: pageSize,
    brandId: brandFilter ? Number(brandFilter) : undefined,
    categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    sortKey,
    sortDirection,
  });
  const deactivateProduct = useDeactivateProduct();
  const deleteProduct = useDeleteProduct();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDeactivate = (): void => {
    if (!deactivateTarget) {
      return;
    }
    deactivateProduct.mutate(deactivateTarget.id, { onSuccess: () => setDeactivateTarget(null) });
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteProduct.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<ProductResponse>[] = [
    {
      key: 'name',
      header: 'Product Name',
      sortKey: 'name',
      render: (row) => (
        <MuiLink component={RouterLink} to={buildProductDetailPath(row.id)} underline="hover" fontWeight={600}>
          {row.name}
        </MuiLink>
      ),
    },
    { key: 'brand', header: 'Brand', render: (row) => brandNameById.get(row.brandId) ?? '—' },
    { key: 'category', header: 'Category', render: (row) => categoryNameById.get(row.categoryId) ?? '—' },
    { key: 'model', header: 'Model', render: (row) => row.model ?? '—' },
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
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: ProductResponse) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Manage variants">
            <IconButton size="small" onClick={() => navigate(buildProductDetailPath(row.id))}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin ? (
            <>
              <Tooltip title="Edit product">
                <IconButton size="small" onClick={() => setFormProduct(row)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={row.active ? 'Deactivate product' : 'Already inactive'}>
                <span>
                  <IconButton size="small" disabled={!row.active} onClick={() => setDeactivateTarget(row)}>
                    <ToggleOffOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Delete product">
                <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Products' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Products
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormProduct(null)}>
            New Product
          </AppButton>
        ) : null}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FilterSelect
          id="product-brand-filter"
          label="Filter by Brand"
          value={brandFilter}
          emptyLabel="All Brands"
          options={brandOptions}
          onChange={(value) => {
            setBrandFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <FilterSelect
          id="product-category-filter"
          label="Filter by Category"
          value={categoryFilter}
          emptyLabel="All Categories"
          options={categoryOptions}
          onChange={(value) => {
            setCategoryFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      </Stack>

      <DataTable<ProductResponse>
        columns={columns}
        rows={productsQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={productsQuery.isLoading}
        error={productsQuery.isError ? getApiErrorMessage(productsQuery.error) : null}
        onRetry={() => void productsQuery.refetch()}
        emptyTitle="No products found"
        emptyDescription={isAdmin ? 'Create your first product to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={productsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formProduct !== undefined ? (
        <ProductFormDialog
          open
          product={formProduct}
          onClose={() => setFormProduct(undefined)}
          onCreated={(created) => navigate(buildProductDetailPath(created.id))}
        />
      ) : null}

      {isAdmin ? (
        <>
          <ConfirmDialog
            open={deactivateTarget !== null}
            title="Deactivate Product"
            message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will no longer be selectable for new sales or purchases.`}
            confirmLabel="Deactivate"
            confirmVariant="danger"
            loading={deactivateProduct.isPending}
            onConfirm={handleConfirmDeactivate}
            onCancel={() => setDeactivateTarget(null)}
          />
          <ConfirmDialog
            open={deleteTarget !== null}
            title="Delete Product"
            message={`Are you sure you want to delete "${deleteTarget?.name}"? It will be removed from every listing; existing variants, prices, and stock history are preserved for referential integrity but will no longer be reachable from this screen.`}
            confirmLabel="Delete"
            confirmVariant="danger"
            loading={deleteProduct.isPending}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      ) : null}
    </Stack>
  );
}
