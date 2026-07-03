import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMemo, useState, type JSX } from 'react';
import { useParams } from 'react-router-dom';

import {
  ALLOWED_REPAIR_TRANSITIONS,
  TERMINAL_REPAIR_STATUSES,
} from '@/common/constants/repairStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { RepairStatusChip } from '@/components/RepairStatusChip';
import { useCustomer } from '@/modules/customer';
import { useStock } from '@/modules/inventory';
import { RepairFormDialog } from '@/modules/repair/components/RepairFormDialog';
import { RepairPaymentsPanel } from '@/modules/repair/components/RepairPaymentsPanel';
import { RepairStatusFormDialog } from '@/modules/repair/components/RepairStatusFormDialog';
import { useRepairPaymentBalance } from '@/modules/repair/hooks/useRepairPayments';
import { useRepair } from '@/modules/repair/hooks/useRepairs';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';

/** Repair detail — see 04_TASKS.md P08-T001. No delete; status workflow + optional payments. */
export function RepairDetailPage(): JSX.Element {
  const { repairId } = useParams<{ repairId: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const repairQuery = useRepair(repairId);
  const balanceQuery = useRepairPaymentBalance(repairId);
  const customerQuery = useCustomer(repairQuery.data?.customerId);
  const stockQuery = useStock(repairQuery.data?.stockId ?? undefined);

  const isTerminal = repairQuery.data
    ? TERMINAL_REPAIR_STATUSES.includes(repairQuery.data.repairStatus)
    : false;
  const hasStatusTransitions = repairQuery.data
    ? (ALLOWED_REPAIR_TRANSITIONS[repairQuery.data.repairStatus]?.length ?? 0) > 0
    : false;
  const canRecordPayment =
    !isTerminal &&
    repairQuery.data?.actualCost != null &&
    repairQuery.data.actualCost > 0 &&
    (balanceQuery.data?.pendingBalance ?? 0) > 0;

  const stockLabel = useMemo(() => {
    if (!repairQuery.data?.stockId) {
      return 'External device';
    }
    const stock = stockQuery.data;
    return stock?.imei ?? repairQuery.data.stockId.slice(0, 8);
  }, [repairQuery.data, stockQuery.data]);

  if (!repairId) {
    return <ErrorState message="No repair was specified." />;
  }

  if (repairQuery.isLoading) {
    return <PageLoader />;
  }

  if (repairQuery.isError || !repairQuery.data) {
    return (
      <ErrorState
        message={repairQuery.isError ? getApiErrorMessage(repairQuery.error) : 'Repair not found.'}
        onRetry={() => void repairQuery.refetch()}
      />
    );
  }

  const repair = repairQuery.data;

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Repairs', to: ROUTE_PATHS.repairs },
          { label: repair.id.slice(0, 8).toUpperCase() },
        ]}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Repair #{repair.id.slice(0, 8).toUpperCase()}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {!isTerminal ? (
            <>
              <AppButton appVariant="secondary" startIcon={<EditOutlinedIcon />} onClick={() => setEditOpen(true)}>
                Edit
              </AppButton>
              {hasStatusTransitions ? (
                <AppButton
                  appVariant="primary"
                  startIcon={<SyncAltOutlinedIcon />}
                  onClick={() => setStatusOpen(true)}
                >
                  Update Status
                </AppButton>
              ) : null}
            </>
          ) : null}
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1">{customerQuery.data?.name ?? '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Device / Stock
              </Typography>
              <Typography variant="body1">{stockLabel}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Stack direction="row" mt={0.5}>
                <RepairStatusChip status={repair.repairStatus} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Estimated Cost
              </Typography>
              <Typography variant="body1">
                {repair.estimatedCost != null ? formatCurrency(repair.estimatedCost) : '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Actual Cost
              </Typography>
              <Typography variant="body1">
                {repair.actualCost != null ? formatCurrency(repair.actualCost) : '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary">
                Issue Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {repair.issueDescription ?? '—'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {repair.actualCost != null && repair.actualCost > 0 ? (
        <RepairPaymentsPanel repairId={repairId} canRecordPayment={canRecordPayment} />
      ) : null}

      {!isTerminal && editOpen ? (
        <RepairFormDialog open repair={repair} onClose={() => setEditOpen(false)} />
      ) : null}

      {!isTerminal && hasStatusTransitions && statusOpen ? (
        <RepairStatusFormDialog open repair={repair} onClose={() => setStatusOpen(false)} />
      ) : null}
    </Stack>
  );
}
