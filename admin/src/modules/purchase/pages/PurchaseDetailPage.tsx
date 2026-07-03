import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMemo, useState, type JSX } from 'react';
import { useParams } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { PAYMENT_STATUSES } from '@/common/constants/paymentStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { useProductVariantOptions } from '@/modules/product';
import { PurchaseFormDialog } from '@/modules/purchase/components/PurchaseFormDialog';
import { PurchaseItemFormDialog } from '@/modules/purchase/components/PurchaseItemFormDialog';
import { ReceivePurchaseDialog } from '@/modules/purchase/components/ReceivePurchaseDialog';
import { useDeletePurchaseItem } from '@/modules/purchase/hooks/usePurchaseItemMutations';
import { usePurchaseItems } from '@/modules/purchase/hooks/usePurchaseItems';
import { useCancelPurchase } from '@/modules/purchase/hooks/usePurchaseMutations';
import { usePurchase, usePurchaseReceived } from '@/modules/purchase/hooks/usePurchases';
import type { PurchaseItemResponse } from '@/modules/purchase/types/Purchase';
import { useSupplier } from '@/modules/supplier';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/**
 * Purchase detail — see 04_TASKS.md P06-T001/P06-T002. Shows header fields
 * plus line items; Receive creates stock (ADMIN only). Item edits are blocked
 * in the UI after receive since the backend does not enforce this.
 */
export function PurchaseDetailPage(): JSX.Element {
  const { purchaseId } = useParams<{ purchaseId: string }>();
  const { isAdmin } = useAuth();

  const [itemPage, setItemPage] = useState(DEFAULT_PAGE_INDEX);
  const [itemPageSize, setItemPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [editPurchase, setEditPurchase] = useState(false);
  const [formItem, setFormItem] = useState<PurchaseItemResponse | null | undefined>(undefined);
  const [deleteItemTarget, setDeleteItemTarget] = useState<PurchaseItemResponse | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const purchaseQuery = usePurchase(purchaseId);
  const receivedQuery = usePurchaseReceived(purchaseId);
  const itemsQuery = usePurchaseItems(purchaseId);
  const supplierQuery = useSupplier(purchaseQuery.data?.supplierId);
  const { skuById } = useProductVariantOptions();
  const deleteItem = useDeletePurchaseItem();
  const cancelPurchase = useCancelPurchase();

  const isCancelled = purchaseQuery.data?.paymentStatus === PAYMENT_STATUSES.CANCELLED;
  const isReceived = receivedQuery.data === true;
  const isEditable = isAdmin && !isReceived && !isCancelled;
  const canReceive = isAdmin && !isReceived && !isCancelled && (itemsQuery.data?.length ?? 0) > 0;
  const canCancel = isAdmin && isReceived && !isCancelled;

  const pagedItems = useMemo(() => {
    const items = itemsQuery.data ?? [];
    const start = itemPage * itemPageSize;
    return items.slice(start, start + itemPageSize);
  }, [itemsQuery.data, itemPage, itemPageSize]);

  if (!purchaseId) {
    return <ErrorState message="No purchase was specified." />;
  }

  if (purchaseQuery.isLoading || receivedQuery.isLoading) {
    return <PageLoader />;
  }

  if (purchaseQuery.isError || !purchaseQuery.data) {
    return (
      <ErrorState
        message={purchaseQuery.isError ? getApiErrorMessage(purchaseQuery.error) : 'Purchase not found.'}
        onRetry={() => void purchaseQuery.refetch()}
      />
    );
  }

  const purchase = purchaseQuery.data;

  const handleConfirmDeleteItem = (): void => {
    if (!deleteItemTarget) {
      return;
    }
    deleteItem.mutate(
      { purchaseId, itemId: deleteItemTarget.id },
      { onSuccess: () => setDeleteItemTarget(null) }
    );
  };

  const handleConfirmCancel = (): void => {
    cancelPurchase.mutate(purchaseId, { onSuccess: () => setCancelOpen(false) });
  };

  const itemColumns: readonly DataTableColumn<PurchaseItemResponse>[] = [
    { key: 'variant', header: 'SKU', render: (row) => skuById.get(row.variantId) ?? row.variantId },
    { key: 'quantity', header: 'Qty', align: 'center', render: (row) => row.quantity },
    {
      key: 'purchasePrice',
      header: 'Unit Price',
      align: 'right',
      render: (row) => formatCurrency(row.purchasePrice),
    },
    {
      key: 'taxAmount',
      header: 'Tax',
      align: 'right',
      render: (row) => formatCurrency(row.taxAmount),
    },
    {
      key: 'totalAmount',
      header: 'Line Total',
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount),
    },
    ...(isEditable
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: PurchaseItemResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit line item">
                  <IconButton size="small" onClick={() => setFormItem(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove line item">
                  <IconButton size="small" color="error" onClick={() => setDeleteItemTarget(row)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ),
          },
        ]
      : []),
  ];

  const lifecycleLabel = isCancelled ? 'Cancelled' : isReceived ? 'Received' : 'Open';

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Purchases', to: ROUTE_PATHS.purchases },
          { label: purchase.invoiceNumber },
        ]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          {purchase.invoiceNumber}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {isEditable ? (
            <AppButton appVariant="secondary" onClick={() => setEditPurchase(true)}>
              Edit Purchase
            </AppButton>
          ) : null}
          {canReceive ? (
            <AppButton appVariant="primary" startIcon={<LocalShippingOutlinedIcon />} onClick={() => setReceiveOpen(true)}>
              Receive
            </AppButton>
          ) : null}
          {canCancel ? (
            <AppButton appVariant="danger" startIcon={<CancelOutlinedIcon />} onClick={() => setCancelOpen(true)}>
              Cancel Purchase
            </AppButton>
          ) : null}
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Supplier
              </Typography>
              <Typography variant="body1">{supplierQuery.data?.supplierName ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Invoice Date
              </Typography>
              <Typography variant="body1">{formatDate(purchase.invoiceDate)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="body1">{formatCurrency(purchase.totalAmount)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <PaymentStatusChip status={purchase.paymentStatus} />
                <Chip label={lifecycleLabel} size="small" variant="outlined" />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Line Items
        </Typography>
        {isEditable ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormItem(null)}>
            Add Item
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<PurchaseItemResponse>
        columns={itemColumns}
        rows={pagedItems}
        getRowId={(row) => row.id}
        loading={itemsQuery.isLoading}
        error={itemsQuery.isError ? getApiErrorMessage(itemsQuery.error) : null}
        onRetry={() => void itemsQuery.refetch()}
        emptyTitle="No line items"
        emptyDescription={isEditable ? 'Add items before receiving this purchase.' : undefined}
        page={itemPage}
        pageSize={itemPageSize}
        totalCount={itemsQuery.data?.length ?? 0}
        onPageChange={setItemPage}
        onPageSizeChange={(size) => {
          setItemPageSize(size);
          setItemPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {isEditable && editPurchase ? (
        <PurchaseFormDialog open purchase={purchase} onClose={() => setEditPurchase(false)} />
      ) : null}

      {isEditable && formItem !== undefined ? (
        <PurchaseItemFormDialog
          open
          purchaseId={purchaseId}
          item={formItem}
          onClose={() => setFormItem(undefined)}
        />
      ) : null}

      {canReceive && receiveOpen && itemsQuery.data ? (
        <ReceivePurchaseDialog
          open
          purchaseId={purchaseId}
          items={itemsQuery.data}
          onClose={() => setReceiveOpen(false)}
        />
      ) : null}

      {isEditable && deleteItemTarget ? (
        <ConfirmDialog
          open
          title="Remove Line Item"
          message="Are you sure you want to remove this line item?"
          confirmLabel="Remove"
          confirmVariant="danger"
          loading={deleteItem.isPending}
          onConfirm={handleConfirmDeleteItem}
          onCancel={() => setDeleteItemTarget(null)}
        />
      ) : null}

      {canCancel ? (
        <ConfirmDialog
          open={cancelOpen}
          title="Cancel Purchase"
          message="This will soft-delete all stock created from this purchase and mark it as cancelled. Units that have already been sold cannot be cancelled."
          confirmLabel="Cancel Purchase"
          confirmVariant="danger"
          loading={cancelPurchase.isPending}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelOpen(false)}
        />
      ) : null}
    </Stack>
  );
}
