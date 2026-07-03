import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, type JSX } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { useBrandOptions } from '@/modules/brand';
import { useCategoryOptions } from '@/modules/category';
import { ProductFormDialog } from '@/modules/product/components/ProductFormDialog';
import { ProductVariantFormDialog } from '@/modules/product/components/ProductVariantFormDialog';
import { useProduct } from '@/modules/product/hooks/useProducts';
import {
  useDeactivateProductVariant,
  useDeleteProductVariant,
} from '@/modules/product/hooks/useProductVariantMutations';
import { useProductVariants } from '@/modules/product/hooks/useProductVariants';
import type { ProductVariantResponse } from '@/modules/product/types/Product';
import { buildVariantDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/**
 * Product detail screen — see 04_TASKS.md P04-T001/P04-T002 and AGENTS.md §
 * Product Structure: "Product represents Model. Variant represents Actual
 * Sellable Item." Shows the Product's master fields plus its Variant list
 * (paginated `GET /product-variants?productId=...`); each variant links to
 * its own detail screen for Images/Prices/Attributes management.
 */
export function ProductDetailPage(): JSX.Element {
  const { productId } = useParams<{ productId: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('sku');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editProduct, setEditProduct] = useState(false);
  const [formVariant, setFormVariant] = useState<ProductVariantResponse | null | undefined>(undefined);
  const [deactivateTarget, setDeactivateTarget] = useState<ProductVariantResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductVariantResponse | null>(null);

  const productQuery = useProduct(productId);
  const { nameById: brandNameById } = useBrandOptions();
  const { nameById: categoryNameById } = useCategoryOptions();
  const variantsQuery = useProductVariants({ page, size: pageSize, productId, sortKey, sortDirection });
  const deactivateVariant = useDeactivateProductVariant();
  const deleteVariant = useDeleteProductVariant();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDeactivate = (): void => {
    if (!deactivateTarget) {
      return;
    }
    deactivateVariant.mutate(deactivateTarget.id, { onSuccess: () => setDeactivateTarget(null) });
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteVariant.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (!productId) {
    return <ErrorState message="No product was specified." />;
  }

  if (productQuery.isLoading) {
    return <PageLoader />;
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <ErrorState
        message={productQuery.isError ? getApiErrorMessage(productQuery.error) : 'Product not found.'}
        onRetry={() => void productQuery.refetch()}
      />
    );
  }

  const product = productQuery.data;

  const columns: readonly DataTableColumn<ProductVariantResponse>[] = [
    {
      key: 'sku',
      header: 'SKU',
      sortKey: 'sku',
      render: (row) => (
        <MuiLink
          component={RouterLink}
          to={buildVariantDetailPath(productId, row.id)}
          underline="hover"
          fontWeight={600}
        >
          {row.sku}
        </MuiLink>
      ),
    },
    { key: 'barcode', header: 'Barcode', render: (row) => row.barcode ?? '—' },
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
      render: (row: ProductVariantResponse) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Manage images, prices &amp; attributes">
            <IconButton size="small" onClick={() => navigate(buildVariantDetailPath(productId, row.id))}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin ? (
            <>
              <Tooltip title="Edit variant">
                <IconButton size="small" onClick={() => setFormVariant(row)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={row.active ? 'Deactivate variant' : 'Already inactive'}>
                <span>
                  <IconButton size="small" disabled={!row.active} onClick={() => setDeactivateTarget(row)}>
                    <ToggleOffOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Delete variant">
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
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Products', to: ROUTE_PATHS.products },
          { label: product.name },
        ]}
      />

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={700}>
                {product.name}
              </Typography>
              <Chip
                label={product.active ? 'Active' : 'Inactive'}
                color={product.active ? 'success' : 'default'}
                size="small"
                variant="outlined"
                sx={{ width: 'fit-content' }}
              />
            </Stack>
            {isAdmin ? (
              <AppButton appVariant="secondary" startIcon={<EditOutlinedIcon />} onClick={() => setEditProduct(true)}>
                Edit Product
              </AppButton>
            ) : null}
          </Stack>

          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Brand
              </Typography>
              <Typography variant="body1">{brandNameById.get(product.brandId) ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1">{categoryNameById.get(product.categoryId) ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Model
              </Typography>
              <Typography variant="body1">{product.model ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                HSN Code
              </Typography>
              <Typography variant="body1">{product.hsnCode ?? '—'}</Typography>
            </Grid>
            {product.description ? (
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{product.description}</Typography>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          Variants
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormVariant(null)}>
            New Variant
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<ProductVariantResponse>
        columns={columns}
        rows={variantsQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={variantsQuery.isLoading}
        error={variantsQuery.isError ? getApiErrorMessage(variantsQuery.error) : null}
        onRetry={() => void variantsQuery.refetch()}
        emptyTitle="No variants found"
        emptyDescription={isAdmin ? 'Create the first sellable variant for this product.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={variantsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && editProduct ? (
        <ProductFormDialog open product={product} onClose={() => setEditProduct(false)} />
      ) : null}

      {isAdmin && formVariant !== undefined ? (
        <ProductVariantFormDialog
          open
          productId={productId}
          variant={formVariant}
          onClose={() => setFormVariant(undefined)}
          onCreated={(created) => navigate(buildVariantDetailPath(productId, created.id))}
        />
      ) : null}

      {isAdmin ? (
        <>
          <ConfirmDialog
            open={deactivateTarget !== null}
            title="Deactivate Variant"
            message={`Are you sure you want to deactivate "${deactivateTarget?.sku}"? It will no longer be selectable for new sales or purchases.`}
            confirmLabel="Deactivate"
            confirmVariant="danger"
            loading={deactivateVariant.isPending}
            onConfirm={handleConfirmDeactivate}
            onCancel={() => setDeactivateTarget(null)}
          />
          <ConfirmDialog
            open={deleteTarget !== null}
            title="Delete Variant"
            message={`Are you sure you want to delete "${deleteTarget?.sku}"? It will be removed from every listing; existing prices, images, and stock history are preserved for referential integrity but will no longer be reachable from this screen.`}
            confirmLabel="Delete"
            confirmVariant="danger"
            loading={deleteVariant.isPending}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      ) : null}
    </Stack>
  );
}
