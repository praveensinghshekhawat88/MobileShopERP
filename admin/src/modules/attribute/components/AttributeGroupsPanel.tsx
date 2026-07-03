import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { AttributeGroupFormDialog } from '@/modules/attribute/components/AttributeGroupFormDialog';
import { useDeleteAttributeGroup } from '@/modules/attribute/hooks/useAttributeGroupMutations';
import { useAttributeGroups } from '@/modules/attribute/hooks/useAttributeGroups';
import type { AttributeGroupResponse } from '@/modules/attribute/types/Attribute';
import { getApiErrorMessage } from '@/utils/apiError';

interface AttributeGroupsPanelProps {
  readonly isAdmin: boolean;
}

/**
 * Attribute Group tab — see 04_TASKS.md P03-T003. Delete is a genuine hard
 * delete (see `AttributeGroupService#delete`, no `active` field exists on
 * this master), so the confirmation copy is explicit about permanence.
 */
export function AttributeGroupsPanel({ isAdmin }: AttributeGroupsPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [formGroup, setFormGroup] = useState<AttributeGroupResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<AttributeGroupResponse | null>(null);

  const groupsQuery = useAttributeGroups({ page, size: pageSize, sortKey, sortDirection });
  const deleteGroup = useDeleteAttributeGroup();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteGroup.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<AttributeGroupResponse>[] = [
    { key: 'name', header: 'Group Name', sortKey: 'name', render: (row) => row.name },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: AttributeGroupResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit group">
                  <IconButton size="small" onClick={() => setFormGroup(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete group">
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
    <Stack spacing={2}>
      {isAdmin ? (
        <Stack direction="row" justifyContent="flex-end">
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormGroup(null)}>
            New Group
          </AppButton>
        </Stack>
      ) : null}

      <DataTable<AttributeGroupResponse>
        columns={columns}
        rows={groupsQuery.data?.content ?? []}
        getRowId={(row) => String(row.id)}
        loading={groupsQuery.isLoading}
        error={groupsQuery.isError ? getApiErrorMessage(groupsQuery.error) : null}
        onRetry={() => void groupsQuery.refetch()}
        emptyTitle="No attribute groups found"
        emptyDescription={isAdmin ? 'Create your first attribute group to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={groupsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formGroup !== undefined ? (
        <AttributeGroupFormDialog open attributeGroup={formGroup} onClose={() => setFormGroup(undefined)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Attribute Group"
          message={`This will permanently delete "${deleteTarget?.name}" and cannot be undone. Attributes still assigned to this group must be moved or deleted first.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteGroup.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
