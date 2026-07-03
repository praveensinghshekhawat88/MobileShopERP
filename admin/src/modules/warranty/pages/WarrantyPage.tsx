import AddIcon from '@mui/icons-material/Add';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import { Chip, Stack, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { CLAIM_STATUSES } from '@/common/constants/claimStatus';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ClaimStatusChip } from '@/components/ClaimStatusChip';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { WarrantyFormDialog } from '@/modules/warranty/components/WarrantyFormDialog';
import { useWarranties } from '@/modules/warranty/hooks/useWarranties';
import { useSubmitWarrantyClaim } from '@/modules/warranty/hooks/useWarrantyMutations';
import type { WarrantyResponse } from '@/modules/warranty/types/Warranty';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDate } from '@/utils/formatDate';

/** Warranty list — see 04_TASKS.md P08-T002. Create + claim only; no edit/delete API. */
export function WarrantyPage(): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [formOpen, setFormOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<WarrantyResponse | null>(null);

  const warrantiesQuery = useWarranties({ page, size: pageSize, sortKey, sortDirection });
  const submitClaim = useSubmitWarrantyClaim();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmClaim = (): void => {
    if (!claimTarget) {
      return;
    }
    submitClaim.mutate(claimTarget.id, { onSuccess: () => setClaimTarget(null) });
  };

  const columns: readonly DataTableColumn<WarrantyResponse>[] = [
    {
      key: 'saleItemId',
      header: 'Sale Item',
      render: (row) => row.saleItemId.slice(0, 8).toUpperCase(),
    },
    {
      key: 'warrantyMonths',
      header: 'Months',
      align: 'center',
      render: (row) => row.warrantyMonths,
    },
    {
      key: 'startDate',
      header: 'Start',
      sortKey: 'startDate',
      render: (row) => formatDate(row.startDate),
    },
    {
      key: 'endDate',
      header: 'End',
      render: (row) => formatDate(row.endDate),
    },
    {
      key: 'claimStatus',
      header: 'Claim Status',
      align: 'center',
      render: (row) => <ClaimStatusChip status={row.claimStatus} />,
    },
    {
      key: 'expired',
      header: 'Expiry',
      align: 'center',
      render: (row) =>
        row.expired ? (
          <Chip label="Expired" size="small" color="error" variant="outlined" />
        ) : (
          <Chip label="Valid" size="small" color="success" variant="outlined" />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: WarrantyResponse) =>
        row.claimStatus === CLAIM_STATUSES.ACTIVE && !row.expired ? (
          <AppButton
            appVariant="secondary"
            size="small"
            startIcon={<GavelOutlinedIcon />}
            onClick={() => setClaimTarget(row)}
          >
            Submit Claim
          </AppButton>
        ) : null,
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Warranties' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Warranties
        </Typography>
        <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          New Warranty
        </AppButton>
      </Stack>

      <DataTable<WarrantyResponse>
        columns={columns}
        rows={warrantiesQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={warrantiesQuery.isLoading}
        error={warrantiesQuery.isError ? getApiErrorMessage(warrantiesQuery.error) : null}
        onRetry={() => void warrantiesQuery.refetch()}
        emptyTitle="No warranties found"
        emptyDescription="Register a warranty for a sold item."
        page={page}
        pageSize={pageSize}
        totalCount={warrantiesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {formOpen ? <WarrantyFormDialog open onClose={() => setFormOpen(false)} /> : null}

      {claimTarget ? (
        <ConfirmDialog
          open
          title="Submit Warranty Claim"
          message="Submit a warranty claim for this sold item? This will mark the warranty as claimed."
          confirmLabel="Submit Claim"
          confirmVariant="primary"
          loading={submitClaim.isPending}
          onConfirm={handleConfirmClaim}
          onCancel={() => setClaimTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
