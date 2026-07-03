import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { useState, type JSX } from 'react';

import { ATTRIBUTE_TYPE_LABELS } from '@/common/constants/attributeType';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { VariantAttributeFormDialog } from '@/modules/product/components/VariantAttributeFormDialog';
import { useRemoveVariantAttribute } from '@/modules/product/hooks/useVariantAttributeMutations';
import { useVariantAttributes } from '@/modules/product/hooks/useVariantAttributes';
import type { VariantAttributeDetailResponse } from '@/modules/product/types/Product';
import { getApiErrorMessage } from '@/utils/apiError';

interface VariantAttributesPanelProps {
  readonly variantId: string;
  readonly isAdmin: boolean;
}

/**
 * Dynamic Attributes tab — see 04_TASKS.md P04-T005 and AGENTS.md §
 * Attribute Engine. `GET /variant-attributes?variantId=...` returns a plain
 * (non-paginated) list ordered `createdAt ASC`; pagination here is
 * client-side over that already-small, per-variant assignment set. Removal
 * is a genuine hard delete (see backend reference).
 */
export function VariantAttributesPanel({ variantId, isAdmin }: VariantAttributesPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<VariantAttributeDetailResponse | null>(null);

  const attributesQuery = useVariantAttributes(variantId);
  const removeAttribute = useRemoveVariantAttribute(variantId);

  const allAttributes = attributesQuery.data ?? [];
  const pageRows = allAttributes.slice(page * pageSize, page * pageSize + pageSize);

  const handleConfirmRemove = (): void => {
    if (!removeTarget) {
      return;
    }
    removeAttribute.mutate(removeTarget.id, { onSuccess: () => setRemoveTarget(null) });
  };

  const columns: readonly DataTableColumn<VariantAttributeDetailResponse>[] = [
    { key: 'attributeGroupName', header: 'Group', render: (row) => row.attributeGroupName },
    { key: 'attributeName', header: 'Attribute', render: (row) => row.attributeName },
    { key: 'value', header: 'Value', render: (row) => row.value },
    {
      key: 'attributeType',
      header: 'Type',
      render: (row) => (
        <Chip label={ATTRIBUTE_TYPE_LABELS[row.attributeType]} size="small" variant="outlined" />
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: VariantAttributeDetailResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Remove attribute value">
                  <IconButton size="small" color="error" onClick={() => setRemoveTarget(row)}>
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
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            Assign Value
          </AppButton>
        </Stack>
      ) : null}

      <DataTable<VariantAttributeDetailResponse>
        columns={columns}
        rows={pageRows}
        getRowId={(row) => row.id}
        loading={attributesQuery.isLoading}
        error={attributesQuery.isError ? getApiErrorMessage(attributesQuery.error) : null}
        onRetry={() => void attributesQuery.refetch()}
        emptyTitle="No attributes assigned"
        emptyDescription={isAdmin ? 'Assign the first attribute value for this variant.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={allAttributes.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {isAdmin && formOpen ? (
        <VariantAttributeFormDialog open variantId={variantId} onClose={() => setFormOpen(false)} />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={removeTarget !== null}
          title="Remove Attribute Value"
          message={`Are you sure you want to remove "${removeTarget?.attributeName}: ${removeTarget?.value}" from this variant? This action cannot be undone.`}
          confirmLabel="Remove"
          confirmVariant="danger"
          loading={removeAttribute.isPending}
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemoveTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
