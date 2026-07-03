import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, type JSX } from 'react';
import { useParams } from 'react-router-dom';

import { MOVEMENT_TYPE_LABELS } from '@/common/constants/movementType';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { REFERENCE_TYPE_LABELS } from '@/common/constants/referenceType';
import { ALLOWED_STOCK_TRANSITIONS } from '@/common/constants/stockStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { StockStatusChip } from '@/components/StockStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { StockMetadataFormDialog } from '@/modules/inventory/components/StockMetadataFormDialog';
import { StockStatusFormDialog } from '@/modules/inventory/components/StockStatusFormDialog';
import { useStock } from '@/modules/inventory/hooks/useStock';
import { useStockMovements } from '@/modules/inventory/hooks/useStockMovements';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import { useProductVariantOptions } from '@/modules/product';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTime } from '@/utils/formatDate';

/** Stock detail — see P06-T003/P06-T004/P06-T005. Metadata and status are separate actions. */
export function StockDetailPage(): JSX.Element {
  const { stockId } = useParams<{ stockId: string }>();
  const { isAdmin } = useAuth();
  const [movementPage, setMovementPage] = useState(DEFAULT_PAGE_INDEX);
  const [movementPageSize, setMovementPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [editMetadata, setEditMetadata] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);

  const stockQuery = useStock(stockId);
  const { skuById } = useProductVariantOptions();
  const movementsQuery = useStockMovements({
    page: movementPage,
    size: movementPageSize,
    stockId,
    sortKey: 'createdAt',
    sortDirection: 'desc',
  });

  if (!stockId) {
    return <ErrorState message="No stock record was specified." />;
  }

  if (stockQuery.isLoading) {
    return <PageLoader />;
  }

  if (stockQuery.isError || !stockQuery.data) {
    return (
      <ErrorState
        message={stockQuery.isError ? getApiErrorMessage(stockQuery.error) : 'Stock record not found.'}
        onRetry={() => void stockQuery.refetch()}
      />
    );
  }

  const stock = stockQuery.data;
  const canChangeStatus = isAdmin && (ALLOWED_STOCK_TRANSITIONS[stock.stockStatus]?.length ?? 0) > 0;

  const movementColumns: readonly DataTableColumn<StockMovementResponse>[] = [
    {
      key: 'movementType',
      header: 'Type',
      render: (row) => MOVEMENT_TYPE_LABELS[row.movementType],
    },
    {
      key: 'referenceType',
      header: 'Reference',
      render: (row) => `${REFERENCE_TYPE_LABELS[row.referenceType]} (${row.referenceId.slice(0, 8)}…)`,
    },
    { key: 'remarks', header: 'Remarks', render: (row) => row.remarks ?? '—' },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Stock', to: ROUTE_PATHS.stock },
          { label: stock.imei ?? stock.id.slice(0, 8) },
        ]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Stock Detail
        </Typography>
        {isAdmin ? (
          <Stack direction="row" spacing={1}>
            <AppButton appVariant="secondary" startIcon={<EditOutlinedIcon />} onClick={() => setEditMetadata(true)}>
              Edit Metadata
            </AppButton>
            {canChangeStatus ? (
              <AppButton appVariant="primary" startIcon={<SwapHorizOutlinedIcon />} onClick={() => setChangeStatus(true)}>
                Change Status
              </AppButton>
            ) : null}
          </Stack>
        ) : null}
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                IMEI
              </Typography>
              <Typography variant="body1">{stock.imei ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Serial Number
              </Typography>
              <Typography variant="body1">{stock.serialNumber ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                SKU
              </Typography>
              <Typography variant="body1">{skuById.get(stock.variantId) ?? stock.variantId}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Stack mt={0.5}>
                <StockStatusChip status={stock.stockStatus} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={600}>
        Movement History
      </Typography>

      <DataTable<StockMovementResponse>
        columns={movementColumns}
        rows={movementsQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={movementsQuery.isLoading}
        error={movementsQuery.isError ? getApiErrorMessage(movementsQuery.error) : null}
        onRetry={() => void movementsQuery.refetch()}
        emptyTitle="No movements recorded"
        page={movementPage}
        pageSize={movementPageSize}
        totalCount={movementsQuery.data?.totalElements ?? 0}
        onPageChange={setMovementPage}
        onPageSizeChange={(size) => {
          setMovementPageSize(size);
          setMovementPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {isAdmin && editMetadata ? (
        <StockMetadataFormDialog open stock={stock} onClose={() => setEditMetadata(false)} />
      ) : null}

      {isAdmin && changeStatus ? (
        <StockStatusFormDialog open stock={stock} onClose={() => setChangeStatus(false)} />
      ) : null}
    </Stack>
  );
}
