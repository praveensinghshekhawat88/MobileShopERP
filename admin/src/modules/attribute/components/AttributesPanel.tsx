import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { useState, type JSX } from 'react';

import { ATTRIBUTE_TYPE_LABELS } from '@/common/constants/attributeType';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { AttributeFormDialog } from '@/modules/attribute/components/AttributeFormDialog';
import { useAttributeGroupOptions } from '@/modules/attribute/hooks/useAttributeGroups';
import { useDeleteAttribute } from '@/modules/attribute/hooks/useAttributeMutations';
import { useAttributes } from '@/modules/attribute/hooks/useAttributes';
import type { AttributeResponse } from '@/modules/attribute/types/Attribute';
import { getApiErrorMessage } from '@/utils/apiError';

interface AttributesPanelProps {
  readonly isAdmin: boolean;
}

const ALL_GROUPS_FILTER_VALUE = 'ALL';

/**
 * Attribute tab — see 04_TASKS.md P03-T004. Delete is a genuine hard delete
 * (see `AttributeService#delete`, no `active` field exists on this master).
 * Supports filtering by attribute group (`GET /attributes?attributeGroupId=`).
 */
export function AttributesPanel({ isAdmin }: AttributesPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [groupFilter, setGroupFilter] = useState<string>(ALL_GROUPS_FILTER_VALUE);
  const [formAttribute, setFormAttribute] = useState<AttributeResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<AttributeResponse | null>(null);

  const { options: groupOptions, nameById: groupNameById } = useAttributeGroupOptions();
  const attributeGroupId = groupFilter === ALL_GROUPS_FILTER_VALUE ? undefined : Number(groupFilter);
  const attributesQuery = useAttributes({ page, size: pageSize, attributeGroupId, sortKey, sortDirection });
  const deleteAttribute = useDeleteAttribute();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteAttribute.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<AttributeResponse>[] = [
    { key: 'name', header: 'Attribute Name', sortKey: 'name', render: (row) => row.name },
    {
      key: 'group',
      header: 'Attribute Group',
      render: (row) => groupNameById.get(row.attributeGroupId) ?? '—',
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => <Chip label={ATTRIBUTE_TYPE_LABELS[row.attributeType]} size="small" variant="outlined" />,
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: AttributeResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit attribute">
                  <IconButton size="small" onClick={() => setFormAttribute(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete attribute">
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
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <FilterSelect
          id="attribute-group-filter"
          label="Filter by Group"
          value={groupFilter}
          emptyValue={ALL_GROUPS_FILTER_VALUE}
          emptyLabel="All Groups"
          options={groupOptions}
          onChange={(value) => {
            setGroupFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />

        {isAdmin ? (
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormAttribute(null)}>
            New Attribute
          </AppButton>
        ) : null}
      </Stack>

      <DataTable<AttributeResponse>
        columns={columns}
        rows={attributesQuery.data?.content ?? []}
        getRowId={(row) => String(row.id)}
        loading={attributesQuery.isLoading}
        error={attributesQuery.isError ? getApiErrorMessage(attributesQuery.error) : null}
        onRetry={() => void attributesQuery.refetch()}
        emptyTitle="No attributes found"
        emptyDescription={isAdmin ? 'Create your first attribute to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={attributesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formAttribute !== undefined ? (
        <AttributeFormDialog open attribute={formAttribute} onClose={() => setFormAttribute(undefined)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Attribute"
          message={`This will permanently delete "${deleteTarget?.name}" and cannot be undone. Attribute values still assigned to it must be deleted first.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteAttribute.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
