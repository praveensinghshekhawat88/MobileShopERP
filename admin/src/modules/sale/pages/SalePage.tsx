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
import { useCustomerOptions } from '@/modules/customer';
import { SaleFormDialog } from '@/modules/sale/components/SaleFormDialog';
import { useSales } from '@/modules/sale/hooks/useSales';
import type { SaleResponse } from '@/modules/sale/types/Sale';
import { buildSaleDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Sale list — see 04_TASKS.md P07-T001. Filterable by customer only. */
export function SalePage(): JSX.Element {
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [customerFilter, setCustomerFilter] = useState('');
  const [formSale, setFormSale] = useState<SaleResponse | null | undefined>(undefined);

  const { options: customerOptions, nameById: customerNameById } = useCustomerOptions();
  const salesQuery = useSales({
    page,
    size: pageSize,
    customerId: customerFilter || undefined,
    sortKey,
    sortDirection,
  });

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const columns: readonly DataTableColumn<SaleResponse>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortKey: 'invoiceNumber',
      render: (row) => (
        <MuiLink component={RouterLink} to={buildSaleDetailPath(row.id)} underline="hover" fontWeight={600}>
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
    { key: 'customer', header: 'Customer', render: (row) => customerNameById.get(row.customerId) ?? '—' },
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
      render: (row: SaleResponse) => (
        <Tooltip title="View sale">
          <IconButton size="small" onClick={() => navigate(buildSaleDetailPath(row.id))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Sales' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Sales
        </Typography>
        <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormSale(null)}>
          New Sale
        </AppButton>
      </Stack>

      <FilterSelect
        id="sale-customer-filter"
        label="Filter by Customer"
        value={customerFilter}
        emptyLabel="All Customers"
        options={customerOptions}
        onChange={(value) => {
          setCustomerFilter(value);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      <DataTable<SaleResponse>
        columns={columns}
        rows={salesQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={salesQuery.isLoading}
        error={salesQuery.isError ? getApiErrorMessage(salesQuery.error) : null}
        onRetry={() => void salesQuery.refetch()}
        emptyTitle="No sales found"
        emptyDescription="Create your first sale to get started."
        page={page}
        pageSize={pageSize}
        totalCount={salesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {formSale !== undefined ? (
        <SaleFormDialog
          open
          sale={formSale}
          onClose={() => setFormSale(undefined)}
          onCreated={(created) => navigate(buildSaleDetailPath(created.id))}
        />
      ) : null}
    </Stack>
  );
}
