import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Stack, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { REPAIR_STATUS_LABELS } from '@/common/constants/repairStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RepairStatusChip } from '@/components/RepairStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { ReportStatGrid } from '@/modules/report/components/ReportStatGrid';
import { useRepairReportList, useRepairReportSummary } from '@/modules/report/hooks/useReports';
import type { RepairReportRow } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';

/** Repair report — see 04_TASKS.md P09-T006. */
export function RepairReportPage(): JSX.Element {
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const range = { fromDate, toDate };

  const summaryQuery = useRepairReportSummary(range);
  const listQuery = useRepairReportList({ ...range, page, size: pageSize });

  const columns: readonly DataTableColumn<RepairReportRow>[] = [
    { key: 'customerName', header: 'Customer', render: (r) => r.customerName },
    { key: 'imei', header: 'IMEI', render: (r) => r.imei ?? 'External' },
    { key: 'repairStatus', header: 'Status', render: (r) => <RepairStatusChip status={r.repairStatus} /> },
    { key: 'estimatedCost', header: 'Est.', align: 'right', render: (r) => (r.estimatedCost != null ? formatCurrency(r.estimatedCost) : '—') },
    { key: 'actualCost', header: 'Actual', align: 'right', render: (r) => (r.actualCost != null ? formatCurrency(r.actualCost) : '—') },
    { key: 'createdAt', header: 'Created', render: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Repairs' }]} />
      <Typography variant="h5" fontWeight={700}>Repair Report</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <ReportStatGrid>
        <StatCard label="Open Repairs" value={formatNumber(summaryQuery.data?.totalOpenRepairs ?? 0)} icon={BuildOutlinedIcon} loading={summaryQuery.isLoading} />
        <StatCard label="Delivered" value={formatNumber(summaryQuery.data?.deliveredCount ?? 0)} icon={CheckCircleOutlinedIcon} loading={summaryQuery.isLoading} iconColor="success" />
        <StatCard label="Delivered Cost" value={formatCurrency(summaryQuery.data?.totalDeliveredCost ?? 0)} icon={CheckCircleOutlinedIcon} loading={summaryQuery.isLoading} iconColor="info" />
      </ReportStatGrid>
      {summaryQuery.data?.openByStatus.length ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {summaryQuery.data.openByStatus.map((item) => (
            <Typography key={item.status} variant="body2">{REPAIR_STATUS_LABELS[item.status]}: {item.count}</Typography>
          ))}
        </Stack>
      ) : null}
      <DataTable columns={columns} rows={listQuery.data?.content ?? []} getRowId={(r) => r.id} loading={listQuery.isLoading} error={listQuery.isError ? getApiErrorMessage(listQuery.error) : null} onRetry={() => void listQuery.refetch()} emptyTitle="No repairs in this period" page={page} pageSize={pageSize} totalCount={listQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
    </Stack>
  );
}
