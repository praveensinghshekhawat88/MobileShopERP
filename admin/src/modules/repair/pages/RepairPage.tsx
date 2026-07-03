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
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS, type RepairStatus } from '@/common/constants/repairStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { RepairStatusChip } from '@/components/RepairStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useCustomerOptions } from '@/modules/customer';
import { RepairFormDialog } from '@/modules/repair/components/RepairFormDialog';
import { useRepairs } from '@/modules/repair/hooks/useRepairs';
import type { RepairResponse } from '@/modules/repair/types/Repair';
import { buildRepairDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';

/** Repair list — see 04_TASKS.md P08-T001. Filterable by customer and status. */
export function RepairPage(): JSX.Element {
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<RepairStatus | ''>('');
  const [formRepair, setFormRepair] = useState<RepairResponse | null | undefined>(undefined);

  const { options: customerOptions, nameById: customerNameById } = useCustomerOptions();
  const repairsQuery = useRepairs({
    page,
    size: pageSize,
    customerId: customerFilter || undefined,
    status: statusFilter || undefined,
    sortKey,
    sortDirection,
  });

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const columns: readonly DataTableColumn<RepairResponse>[] = [
    {
      key: 'id',
      header: 'Ticket',
      render: (row) => (
        <MuiLink component={RouterLink} to={buildRepairDetailPath(row.id)} underline="hover" fontWeight={600}>
          {row.id.slice(0, 8).toUpperCase()}
        </MuiLink>
      ),
    },
    { key: 'customer', header: 'Customer', render: (row) => customerNameById.get(row.customerId) ?? '—' },
    {
      key: 'repairStatus',
      header: 'Status',
      align: 'center',
      render: (row) => <RepairStatusChip status={row.repairStatus} />,
    },
    {
      key: 'estimatedCost',
      header: 'Est. Cost',
      align: 'right',
      render: (row) => (row.estimatedCost != null ? formatCurrency(row.estimatedCost) : '—'),
    },
    {
      key: 'actualCost',
      header: 'Actual Cost',
      align: 'right',
      render: (row) => (row.actualCost != null ? formatCurrency(row.actualCost) : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: RepairResponse) => (
        <Tooltip title="View repair">
          <IconButton size="small" onClick={() => navigate(buildRepairDetailPath(row.id))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Repairs' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Repairs
        </Typography>
        <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormRepair(null)}>
          New Repair
        </AppButton>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FilterSelect
          id="repair-customer-filter"
          label="Filter by Customer"
          value={customerFilter}
          emptyLabel="All Customers"
          options={customerOptions}
          onChange={(value) => {
            setCustomerFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <FilterSelect
          id="repair-status-filter"
          label="Filter by Status"
          value={statusFilter}
          emptyLabel="All Statuses"
          options={Object.values(REPAIR_STATUSES).map((status) => ({
            value: status,
            label: REPAIR_STATUS_LABELS[status],
          }))}
          onChange={(value) => {
            setStatusFilter(value as RepairStatus | '');
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      </Stack>

      <DataTable<RepairResponse>
        columns={columns}
        rows={repairsQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={repairsQuery.isLoading}
        error={repairsQuery.isError ? getApiErrorMessage(repairsQuery.error) : null}
        onRetry={() => void repairsQuery.refetch()}
        emptyTitle="No repair tickets found"
        emptyDescription="Create a repair ticket to track device service."
        page={page}
        pageSize={pageSize}
        totalCount={repairsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {formRepair !== undefined ? (
        <RepairFormDialog
          open
          repair={formRepair}
          onClose={() => setFormRepair(undefined)}
          onCreated={(created) => navigate(buildRepairDetailPath(created.id))}
        />
      ) : null}
    </Stack>
  );
}
