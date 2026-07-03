import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
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
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { PurchaseFormDialog } from '@/modules/purchase/components/PurchaseFormDialog';
import { usePurchases } from '@/modules/purchase/hooks/usePurchases';
import type { PurchaseResponse } from '@/modules/purchase/types/Purchase';
import { useSupplierOptions } from '@/modules/supplier';
import { buildPurchaseDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/**
 * Purchase list — see 04_TASKS.md P06-T001. Filterable by supplier only
 * (no free-text search on `GET /purchases`). Create/receive/cancel are
 * ADMIN-only; list/read is ADMIN+STAFF.
 */
export function PurchasePage(): JSX.Element {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [formPurchase, setFormPurchase] = useState<PurchaseResponse | null | undefined>(undefined);

  const { options: supplierOptions, nameById: supplierNameById } = useSupplierOptions();
  const purchasesQuery = usePurchases({
    page,
    size: pageSize,
    supplierId: supplierFilter || undefined,
    sortKey,
    sortDirection,
  });

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const columns: readonly DataTableColumn<PurchaseResponse>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortKey: 'invoiceNumber',
      render: (row) => (
        <MuiLink
          component={RouterLink}
          to={buildPurchaseDetailPath(row.id)}
          underline="hover"
          fontWeight={600}
        >
          {row.invoiceNumber}
        </MuiLink>
      ),
    },
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      sortKey: 'invoiceDate',
      render: (row) => formatDate(row.invoiceDate),
    },
    { key: 'supplier', header: 'Supplier', render: (row) => supplierNameById.get(row.supplierId) ?? '—' },
    {
      key: 'totalAmount',
      header: 'Total',
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      align: 'center',
      render: (row) => <PaymentStatusChip status={row.paymentStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: PurchaseResponse) => (
        <Tooltip title="View purchase">
          <IconButton size="small" onClick={() => navigate(buildPurchaseDetailPath(row.id))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Purchases' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Purchases
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormPurchase(null)}>
            New Purchase
          </AppButton>
        ) : null}
      </Stack>

      <FilterSelect
        id="purchase-supplier-filter"
        label="Filter by Supplier"
        value={supplierFilter}
        emptyLabel="All Suppliers"
        options={supplierOptions}
        onChange={(value) => {
          setSupplierFilter(value);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      <DataTable<PurchaseResponse>
        columns={columns}
        rows={purchasesQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={purchasesQuery.isLoading}
        error={purchasesQuery.isError ? getApiErrorMessage(purchasesQuery.error) : null}
        onRetry={() => void purchasesQuery.refetch()}
        emptyTitle="No purchases found"
        emptyDescription={isAdmin ? 'Create your first purchase to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={purchasesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formPurchase !== undefined ? (
        <PurchaseFormDialog
          open
          purchase={formPurchase}
          onClose={() => setFormPurchase(undefined)}
          onCreated={(created) => navigate(buildPurchaseDetailPath(created.id))}
        />
      ) : null}
    </Stack>
  );
}
