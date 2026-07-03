import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import {
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { AttributeValueFormDialog } from '@/modules/attribute/components/AttributeValueFormDialog';
import { useAttributeOptions } from '@/modules/attribute/hooks/useAttributes';
import { useDeactivateAttributeValue } from '@/modules/attribute/hooks/useAttributeValueMutations';
import { useAttributeValues } from '@/modules/attribute/hooks/useAttributeValues';
import type { AttributeValueResponse } from '@/modules/attribute/types/Attribute';
import { getApiErrorMessage } from '@/utils/apiError';

interface AttributeValuesPanelProps {
  readonly isAdmin: boolean;
}

/**
 * Attribute Value tab — see 04_TASKS.md P03-T005. Values are soft
 * deactivated (`is_active = false`), never hard-deleted (see
 * `AttributeValueService#deactivate`). An attribute must be selected before
 * values can be created (the backend requires `attributeId` on create), so
 * the panel starts with the first available attribute selected once loaded.
 */
export function AttributeValuesPanel({ isAdmin }: AttributeValuesPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('displayOrder');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [attributeFilter, setAttributeFilter] = useState<string>('');
  const [formValue, setFormValue] = useState<AttributeValueResponse | null | undefined>(undefined);
  const [deactivateTarget, setDeactivateTarget] = useState<AttributeValueResponse | null>(null);

  const { options: attributeOptions } = useAttributeOptions();
  const attributeId = attributeFilter ? Number(attributeFilter) : undefined;
  const valuesQuery = useAttributeValues({ page, size: pageSize, attributeId, sortKey, sortDirection });
  const deactivateValue = useDeactivateAttributeValue();

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const handleConfirmDeactivate = (): void => {
    if (!deactivateTarget) {
      return;
    }
    deactivateValue.mutate(deactivateTarget.id, { onSuccess: () => setDeactivateTarget(null) });
  };

  const columns: readonly DataTableColumn<AttributeValueResponse>[] = [
    { key: 'value', header: 'Value', sortKey: 'value', render: (row) => row.value },
    {
      key: 'displayOrder',
      header: 'Display Order',
      sortKey: 'displayOrder',
      align: 'right',
      render: (row) => row.displayOrder,
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
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: AttributeValueResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit value">
                  <IconButton size="small" onClick={() => setFormValue(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={row.active ? 'Deactivate value' : 'Already inactive'}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={!row.active}
                      onClick={() => setDeactivateTarget(row)}
                    >
                      <ToggleOffOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
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
          id="attribute-value-filter"
          label="Filter by Attribute"
          value={attributeFilter}
          emptyLabel="All Attributes"
          options={attributeOptions}
          onChange={(value) => {
            setAttributeFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />

        {isAdmin ? (
          <Tooltip title={attributeOptions.length === 0 ? 'Create an attribute first' : ''}>
            <span>
              <AppButton
                appVariant="primary"
                startIcon={<AddIcon />}
                disabled={attributeOptions.length === 0}
                onClick={() => setFormValue(null)}
              >
                New Value
              </AppButton>
            </span>
          </Tooltip>
        ) : null}
      </Stack>

      <DataTable<AttributeValueResponse>
        columns={columns}
        rows={valuesQuery.data?.content ?? []}
        getRowId={(row) => String(row.id)}
        loading={valuesQuery.isLoading}
        error={valuesQuery.isError ? getApiErrorMessage(valuesQuery.error) : null}
        onRetry={() => void valuesQuery.refetch()}
        emptyTitle="No attribute values found"
        emptyDescription={isAdmin ? 'Create your first attribute value to get started.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={valuesQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {isAdmin && formValue !== undefined ? (
        <AttributeValueFormDialog
          open
          attributeValue={formValue}
          defaultAttributeId={attributeId}
          onClose={() => setFormValue(undefined)}
        />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deactivateTarget !== null}
          title="Deactivate Attribute Value"
          message={`Are you sure you want to deactivate "${deactivateTarget?.value}"? It will no longer be selectable for new product variants.`}
          confirmLabel="Deactivate"
          confirmVariant="danger"
          loading={deactivateValue.isPending}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
