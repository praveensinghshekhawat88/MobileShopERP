import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
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
import { useNavigate, useParams } from 'react-router-dom';

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
import { useCustomer } from '@/modules/customer';
import { useAvailableStockOptions } from '@/modules/inventory';
import { FinalizeSaleDialog } from '@/modules/sale/components/FinalizeSaleDialog';
import { SaleFormDialog } from '@/modules/sale/components/SaleFormDialog';
import { SaleItemFormDialog } from '@/modules/sale/components/SaleItemFormDialog';
import { SalePaymentsPanel } from '@/modules/sale/components/SalePaymentsPanel';
import { useSalePaymentBalance } from '@/modules/sale/hooks/usePayments';
import { useDeleteSaleItem } from '@/modules/sale/hooks/useSaleItemMutations';
import { useSaleItems } from '@/modules/sale/hooks/useSaleItems';
import { useCancelSale } from '@/modules/sale/hooks/useSaleMutations';
import { useSale, useSaleFinalized } from '@/modules/sale/hooks/useSales';
import type { SaleItemResponse } from '@/modules/sale/types/Sale';
import { buildSaleInvoicePath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Sale detail — see 04_TASKS.md P07-T001/T002/T003. */
export function SaleDetailPage(): JSX.Element {
  const { saleId } = useParams<{ saleId: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [itemPage, setItemPage] = useState(DEFAULT_PAGE_INDEX);
  const [itemPageSize, setItemPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [editSale, setEditSale] = useState(false);
  const [formItem, setFormItem] = useState<SaleItemResponse | null | undefined>(undefined);
  const [deleteItemTarget, setDeleteItemTarget] = useState<SaleItemResponse | null>(null);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const saleQuery = useSale(saleId);
  const finalizedQuery = useSaleFinalized(saleId);
  const itemsQuery = useSaleItems(saleId);
  const balanceQuery = useSalePaymentBalance(saleId);
  const customerQuery = useCustomer(saleQuery.data?.customerId);
  const { stockById } = useAvailableStockOptions();
  const deleteItem = useDeleteSaleItem();
  const cancelSale = useCancelSale();

  const isFinalized = finalizedQuery.data === true;
  const isPaid = saleQuery.data?.paymentStatus === PAYMENT_STATUSES.PAID;
  const isEditable = isAdmin && !isFinalized;
  const canFinalize = !isFinalized && (itemsQuery.data?.length ?? 0) > 0;
  const canCancel = isAdmin && isFinalized && !isPaid;
  const canRecordPayment = isFinalized && (balanceQuery.data?.pendingBalance ?? 0) > 0;

  const pagedItems = useMemo(() => {
    const items = itemsQuery.data ?? [];
    const start = itemPage * itemPageSize;
    return items.slice(start, start + itemPageSize);
  }, [itemsQuery.data, itemPage, itemPageSize]);

  if (!saleId) {
    return <ErrorState message="No sale was specified." />;
  }

  if (saleQuery.isLoading || finalizedQuery.isLoading) {
    return <PageLoader />;
  }

  if (saleQuery.isError || !saleQuery.data) {
    return (
      <ErrorState
        message={saleQuery.isError ? getApiErrorMessage(saleQuery.error) : 'Sale not found.'}
        onRetry={() => void saleQuery.refetch()}
      />
    );
  }

  const sale = saleQuery.data;
  const lifecycleLabel = isFinalized ? 'Finalized' : 'Open';

  const handleConfirmDeleteItem = (): void => {
    if (!deleteItemTarget) {
      return;
    }
    deleteItem.mutate({ saleId, itemId: deleteItemTarget.id }, { onSuccess: () => setDeleteItemTarget(null) });
  };

  const handleConfirmCancel = (): void => {
    cancelSale.mutate(saleId, {
      onSuccess: () => {
        setCancelOpen(false);
        navigate(ROUTE_PATHS.sales);
      },
    });
  };

  const itemColumns: readonly DataTableColumn<SaleItemResponse>[] = [
    {
      key: 'stock',
      header: 'Stock',
      render: (row) => stockById.get(row.stockId)?.imei ?? row.stockId.slice(0, 8),
    },
    {
      key: 'sellingPrice',
      header: 'Price',
      align: 'right',
      render: (row) => formatCurrency(row.sellingPrice),
    },
    {
      key: 'discount',
      header: 'Discount',
      align: 'right',
      render: (row) => formatCurrency(row.discount),
    },
    {
      key: 'taxAmount',
      header: 'Tax',
      align: 'right',
      render: (row) => formatCurrency(row.taxAmount),
    },
    {
      key: 'lineTotal',
      header: 'Line Total',
      align: 'right',
      render: (row) => formatCurrency(row.lineTotal),
    },
    ...(!isFinalized
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: SaleItemResponse) => (
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

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Sales', to: ROUTE_PATHS.sales },
          { label: sale.invoiceNumber },
        ]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          {sale.invoiceNumber}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <AppButton
            appVariant="secondary"
            startIcon={<ReceiptLongOutlinedIcon />}
            onClick={() => navigate(buildSaleInvoicePath(saleId))}
          >
            View Invoice
          </AppButton>
          {isEditable ? (
            <AppButton appVariant="secondary" onClick={() => setEditSale(true)}>
              Edit Sale
            </AppButton>
          ) : null}
          {canFinalize ? (
            <AppButton appVariant="primary" startIcon={<TaskAltOutlinedIcon />} onClick={() => setFinalizeOpen(true)}>
              Finalize
            </AppButton>
          ) : null}
          {canCancel ? (
            <AppButton appVariant="danger" startIcon={<CancelOutlinedIcon />} onClick={() => setCancelOpen(true)}>
              Cancel Sale
            </AppButton>
          ) : null}
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1">{customerQuery.data?.name ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Invoice Date
              </Typography>
              <Typography variant="body1">{formatDate(sale.invoiceDate)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="body1">{formatCurrency(sale.totalAmount)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <PaymentStatusChip status={sale.paymentStatus} />
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
        {!isFinalized ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormItem(null)}>
            Add Item
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<SaleItemResponse>
        columns={itemColumns}
        rows={pagedItems}
        getRowId={(row) => row.id}
        loading={itemsQuery.isLoading}
        error={itemsQuery.isError ? getApiErrorMessage(itemsQuery.error) : null}
        onRetry={() => void itemsQuery.refetch()}
        emptyTitle="No line items"
        emptyDescription={!isFinalized ? 'Add stock items before finalizing this sale.' : undefined}
        page={itemPage}
        pageSize={itemPageSize}
        totalCount={itemsQuery.data?.length ?? 0}
        onPageChange={setItemPage}
        onPageSizeChange={(size) => {
          setItemPageSize(size);
          setItemPage(DEFAULT_PAGE_INDEX);
        }}
      />

      <SalePaymentsPanel saleId={saleId} canRecordPayment={canRecordPayment} />

      {isEditable && editSale ? (
        <SaleFormDialog open sale={sale} onClose={() => setEditSale(false)} />
      ) : null}

      {!isFinalized && formItem !== undefined ? (
        <SaleItemFormDialog open saleId={saleId} item={formItem} onClose={() => setFormItem(undefined)} />
      ) : null}

      {canFinalize && finalizeOpen ? (
        <FinalizeSaleDialog
          open
          saleId={saleId}
          balanceDue={balanceQuery.data?.pendingBalance ?? sale.totalAmount}
          onClose={() => setFinalizeOpen(false)}
          onSuccess={() => void finalizedQuery.refetch()}
        />
      ) : null}

      {!isFinalized && deleteItemTarget ? (
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
          title="Cancel Sale"
          message="This will restore stock and remove the sale from the list. Sales that are fully paid cannot be cancelled."
          confirmLabel="Cancel Sale"
          confirmVariant="danger"
          loading={cancelSale.isPending}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelOpen(false)}
        />
      ) : null}
    </Stack>
  );
}
