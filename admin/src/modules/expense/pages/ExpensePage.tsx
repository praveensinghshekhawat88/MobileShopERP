import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { ExpenseFormDialog } from '@/modules/expense/components/ExpenseFormDialog';
import { useDeleteExpense } from '@/modules/expense/hooks/useExpenseMutations';
import { useExpenses } from '@/modules/expense/hooks/useExpenses';
import type { ExpenseResponse } from '@/modules/expense/types/Expense';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Expense list — see 04_TASKS.md P08-T003. Create/edit/delete are ADMIN-only. */
export function ExpensePage(): JSX.Element {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('expenseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [formExpense, setFormExpense] = useState<ExpenseResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseResponse | null>(null);

  const dateFilterActive = Boolean(fromDate && toDate);
  const expensesQuery = useExpenses({
    page,
    size: pageSize,
    from: dateFilterActive ? fromDate : undefined,
    to: dateFilterActive ? toDate : undefined,
    sortKey,
    sortDirection,
  });
  const deleteExpense = useDeleteExpense();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteExpense.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<ExpenseResponse>[] = [
    { key: 'title', header: 'Title', sortKey: 'title', render: (row) => row.title },
    {
      key: 'expenseDate',
      header: 'Date',
      sortKey: 'expenseDate',
      render: (row) => formatDate(row.expenseDate),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortKey: 'amount',
      render: (row) => formatCurrency(row.amount),
    },
    { key: 'remarks', header: 'Remarks', render: (row) => row.remarks ?? '—' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: ExpenseResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit expense">
                  <IconButton size="small" onClick={() => setFormExpense(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete expense">
                  <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
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
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Expenses' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Expenses
        </Typography>
        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormExpense(null)}>
            New Expense
          </AppButton>
        ) : null}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          size="small"
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(event) => {
            setFromDate(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <TextField
          size="small"
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(event) => {
            setToDate(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Both dates required to filter by range.
        </Typography>
      </Stack>

      <DataTable<ExpenseResponse>
        columns={columns}
        rows={expensesQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={expensesQuery.isLoading}
        error={expensesQuery.isError ? getApiErrorMessage(expensesQuery.error) : null}
        onRetry={() => void expensesQuery.refetch()}
        emptyTitle="No expenses found"
        emptyDescription={isAdmin ? 'Record shop expenses to track operating costs.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={expensesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formExpense !== undefined ? (
        <ExpenseFormDialog open expense={formExpense} onClose={() => setFormExpense(undefined)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Expense"
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteExpense.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
