import AddIcon from '@mui/icons-material/Add';
import { Stack, Typography } from '@mui/material';
import { useMemo, useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { PAYMENT_MODE_LABELS } from '@/common/constants/paymentMode';
import { AppButton } from '@/components/buttons/AppButton';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { PaymentFormDialog } from '@/modules/sale/components/PaymentFormDialog';
import { useSalePaymentBalance, useSalePayments } from '@/modules/sale/hooks/usePayments';
import type { PaymentResponse } from '@/modules/sale/types/Sale';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';

interface SalePaymentsPanelProps {
  readonly saleId: string;
  readonly canRecordPayment: boolean;
}

/** Payments panel on the sale detail screen — see 04_TASKS.md P07-T003. */
export function SalePaymentsPanel({ saleId, canRecordPayment }: SalePaymentsPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const paymentsQuery = useSalePayments(saleId);
  const balanceQuery = useSalePaymentBalance(saleId);

  const pagedPayments = useMemo(() => {
    const payments = paymentsQuery.data ?? [];
    const start = page * pageSize;
    return payments.slice(start, start + pageSize);
  }, [paymentsQuery.data, page, pageSize]);

  const columns: readonly DataTableColumn<PaymentResponse>[] = [
    {
      key: 'paymentMode',
      header: 'Mode',
      render: (row) => PAYMENT_MODE_LABELS[row.paymentMode],
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => formatCurrency(row.amount),
    },
    { key: 'transactionNumber', header: 'Transaction #', render: (row) => row.transactionNumber ?? '—' },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (row) => formatDateTime(row.paymentDate),
    },
  ];

  const balance = balanceQuery.data;

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" fontWeight={600}>
            Payments
          </Typography>
          {balance ? (
            <>
              <Typography variant="body2">
                Paid: {formatCurrency(balance.amountPaid)} / {formatCurrency(balance.totalAmount)}
              </Typography>
              <Typography variant="body2">Due: {formatCurrency(balance.pendingBalance)}</Typography>
              <PaymentStatusChip status={balance.paymentStatus} />
            </>
          ) : null}
        </Stack>
        {canRecordPayment && balance && balance.pendingBalance > 0 ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setPaymentOpen(true)}>
            Record Payment
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<PaymentResponse>
        columns={columns}
        rows={pagedPayments}
        getRowId={(row) => row.id}
        loading={paymentsQuery.isLoading}
        error={paymentsQuery.isError ? getApiErrorMessage(paymentsQuery.error) : null}
        onRetry={() => void paymentsQuery.refetch()}
        emptyTitle="No payments recorded"
        page={page}
        pageSize={pageSize}
        totalCount={paymentsQuery.data?.length ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {canRecordPayment && paymentOpen && balance ? (
        <PaymentFormDialog
          open
          saleId={saleId}
          maxAmount={balance.pendingBalance}
          onClose={() => setPaymentOpen(false)}
        />
      ) : null}
    </Stack>
  );
}
