import { Chip, Stack, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { useRoles } from '@/modules/role/hooks/useRoles';
import type { RoleResponse } from '@/modules/role/types/Role';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/** Read-only role list — see 04_TASKS.md P10-T002. No role CRUD in UI (backend supports it). */
export function RolePage(): JSX.Element {
  const rolesQuery = useRoles();
  const roles = rolesQuery.data ?? [];
  const [page] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const columns: readonly DataTableColumn<RoleResponse>[] = [
    { key: 'name', header: 'Role', render: (row) => row.name },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description ?? '—',
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
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Roles' }]} />

      <Typography variant="h5" fontWeight={700}>
        Roles
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Read-only view of system roles. Role management is handled outside the admin UI in Phase 1.
      </Typography>

      <DataTable<RoleResponse>
        columns={columns}
        rows={roles}
        getRowId={(row) => String(row.id)}
        loading={rolesQuery.isLoading}
        error={rolesQuery.isError ? getApiErrorMessage(rolesQuery.error) : null}
        onRetry={() => void rolesQuery.refetch()}
        emptyTitle="No roles found"
        page={page}
        pageSize={pageSize}
        totalCount={roles.length}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
      />
    </Stack>
  );
}
