import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Chip, Stack, TextField, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { CLAIM_STATUSES, CLAIM_STATUS_LABELS } from '@/common/constants/claimStatus';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ClaimStatusChip } from '@/components/ClaimStatusChip';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { ReportStatGrid } from '@/modules/report/components/ReportStatGrid';
import { useWarrantyReportList, useWarrantyReportSummary } from '@/modules/report/hooks/useReports';
import type { ClaimStatus, WarrantyReportRow } from '@/modules/report/types/Report';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatNumber } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Warranty report — see 04_TASKS.md P09-T007. */
export function WarrantyReportPage(): JSX.Element {
  const [daysWithin, setDaysWithin] = useState(30);
  const [claimFilter, setClaimFilter] = useState<ClaimStatus | ''>('');
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const summaryQuery = useWarrantyReportSummary({ daysWithin });
  const listQuery = useWarrantyReportList({ page, size: pageSize, claimStatus: claimFilter || undefined });

  const columns: readonly DataTableColumn<WarrantyReportRow>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (r) => r.invoiceNumber },
    { key: 'customerName', header: 'Customer', render: (r) => r.customerName },
    { key: 'imei', header: 'IMEI', render: (r) => r.imei ?? '—' },
    { key: 'startDate', header: 'Start', render: (r) => formatDate(r.startDate) },
    { key: 'endDate', header: 'End', render: (r) => formatDate(r.endDate) },
    { key: 'claimStatus', header: 'Claim', render: (r) => <ClaimStatusChip status={r.claimStatus} /> },
    { key: 'expired', header: 'Expiry', render: (r) => (r.expired ? <Chip label="Expired" size="small" color="error" variant="outlined" /> : <Chip label="Valid" size="small" color="success" variant="outlined" />) },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Warranty' }]} />
      <Typography variant="h5" fontWeight={700}>Warranty Report</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField size="small" label="Expiring Within (days)" type="number" value={daysWithin} onChange={(e) => setDaysWithin(Number(e.target.value))} sx={{ maxWidth: 220 }} />
        <FilterSelect
          id="warranty-claim-filter"
          label="Claim Status"
          value={claimFilter}
          emptyLabel="All"
          minWidth={200}
          options={Object.values(CLAIM_STATUSES).map((status) => ({
            value: status,
            label: CLAIM_STATUS_LABELS[status],
          }))}
          onChange={(value) => {
            setClaimFilter(value as ClaimStatus | '');
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      </Stack>
      <ReportStatGrid>
        <StatCard label="Active" value={formatNumber(summaryQuery.data?.activeCount ?? 0)} icon={VerifiedUserOutlinedIcon} loading={summaryQuery.isLoading} iconColor="success" />
        <StatCard label="Expired" value={formatNumber(summaryQuery.data?.expiredCount ?? 0)} icon={VerifiedUserOutlinedIcon} loading={summaryQuery.isLoading} iconColor="error" />
        <StatCard label="Expiring Soon" value={formatNumber(summaryQuery.data?.expiringSoonCount ?? 0)} icon={WarningAmberOutlinedIcon} loading={summaryQuery.isLoading} iconColor="warning" />
      </ReportStatGrid>
      <DataTable columns={columns} rows={listQuery.data?.content ?? []} getRowId={(r) => r.id} loading={listQuery.isLoading} error={listQuery.isError ? getApiErrorMessage(listQuery.error) : null} onRetry={() => void listQuery.refetch()} emptyTitle="No warranties found" page={page} pageSize={pageSize} totalCount={listQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
    </Stack>
  );
}
