import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useAuth } from '@/modules/auth';
import { UserFormDialog } from '@/modules/user/components/UserFormDialog';
import { useDeleteUser } from '@/modules/user/hooks/useUserMutations';
import { useUsers } from '@/modules/user/hooks/useUsers';
import type { UserResponse } from '@/modules/user/types/User';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTime } from '@/utils/formatDate';

/** User management list — see 04_TASKS.md P10-T001. Route is ADMIN-only. */
export function UserPage(): JSX.Element {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [formUser, setFormUser] = useState<UserResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);

  const usersQuery = useUsers({ page, size: pageSize, sortKey, sortDirection });
  const deleteUser = useDeleteUser();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const columns: readonly DataTableColumn<UserResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      sortKey: 'firstName',
      render: (row) => [row.firstName, row.lastName].filter(Boolean).join(' '),
    },
    { key: 'mobile', header: 'Mobile', sortKey: 'mobile', render: (row) => row.mobile },
    {
      key: 'email',
      header: 'Email',
      render: (row) => row.email ?? '—',
    },
    {
      key: 'roleName',
      header: 'Role',
      sortKey: 'role.name',
      render: (row) => (
        <Chip label={row.roleName} size="small" variant="outlined" color="primary" />
      ),
    },
    {
      key: 'active',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.active ? 'Active' : 'Inactive'}
          color={row.active ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortKey: 'lastLogin',
      render: (row) => (row.lastLogin ? formatDateTime(row.lastLogin) : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const isSelf = row.id === currentUser?.id;
        return (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title="Edit user">
              <IconButton size="small" onClick={() => setFormUser(row)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isSelf ? 'You cannot delete your own account' : 'Delete user'}>
              <span>
                <IconButton
                  size="small"
                  disabled={isSelf}
                  onClick={() => setDeleteTarget(row)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Users' }]} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Users
        </Typography>
        <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormUser(null)}>
          New User
        </AppButton>
      </Stack>

      <DataTable<UserResponse>
        columns={columns}
        rows={usersQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={usersQuery.isLoading}
        error={usersQuery.isError ? getApiErrorMessage(usersQuery.error) : null}
        onRetry={() => void usersQuery.refetch()}
        emptyTitle="No users found"
        emptyDescription="Create a user account to grant access to the admin panel."
        page={page}
        pageSize={pageSize}
        totalCount={usersQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {formUser !== undefined ? (
        <UserFormDialog open user={formUser} onClose={() => setFormUser(undefined)} />
      ) : null}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.firstName}"? They will no longer be able to sign in.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleteUser.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
}
