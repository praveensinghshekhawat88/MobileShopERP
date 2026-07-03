import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar, IconButton, Stack, Tooltip } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { AppButton } from '@/components/buttons/AppButton';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { ProductImageFormDialog } from '@/modules/product/components/ProductImageFormDialog';
import { useDeleteProductImage } from '@/modules/product/hooks/useProductImageMutations';
import { useProductImages } from '@/modules/product/hooks/useProductImages';
import type { ProductImageResponse } from '@/modules/product/types/Product';
import { getApiErrorMessage } from '@/utils/apiError';

interface VariantImagesPanelProps {
  readonly variantId: string;
  readonly isAdmin: boolean;
}

/**
 * Images tab — see 04_TASKS.md P04-T003 and AGENTS.md § Product Image Rule.
 * `GET /variants/{id}/images` returns a plain (non-paginated) list ordered
 * `displayOrder ASC, createdAt ASC`, so pagination here is client-side over
 * that already-small, per-variant collection.
 */
export function VariantImagesPanel({ variantId, isAdmin }: VariantImagesPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formImage, setFormImage] = useState<ProductImageResponse | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<ProductImageResponse | null>(null);

  const imagesQuery = useProductImages(variantId);
  const deleteImage = useDeleteProductImage(variantId);

  const allImages = imagesQuery.data ?? [];
  const pageRows = allImages.slice(page * pageSize, page * pageSize + pageSize);

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) {
      return;
    }
    deleteImage.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns: readonly DataTableColumn<ProductImageResponse>[] = [
    {
      key: 'preview',
      header: 'Preview',
      width: 72,
      render: (row) => <Avatar src={row.imageUrl} variant="rounded" sx={{ width: 56, height: 56 }} />,
    },
    { key: 'imageUrl', header: 'Image URL', render: (row) => row.imageUrl },
    { key: 'displayOrder', header: 'Display Order', align: 'right', render: (row) => row.displayOrder },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: ProductImageResponse) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edit image">
                  <IconButton size="small" onClick={() => setFormImage(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete image">
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
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormImage(null)}>
            Add Image
          </AppButton>
        </Stack>
      ) : null}

      <DataTable<ProductImageResponse>
        columns={columns}
        rows={pageRows}
        getRowId={(row) => row.id}
        loading={imagesQuery.isLoading}
        error={imagesQuery.isError ? getApiErrorMessage(imagesQuery.error) : null}
        onRetry={() => void imagesQuery.refetch()}
        emptyTitle="No images found"
        emptyDescription={isAdmin ? 'Add the first image for this variant.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={allImages.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {isAdmin && formImage !== undefined ? (
        <ProductImageFormDialog
          open
          variantId={variantId}
          image={formImage}
          onClose={() => setFormImage(undefined)}
        />
      ) : null}

      {isAdmin ? (
        <ConfirmDialog
          open={deleteTarget !== null}
          title="Delete Image"
          message="Are you sure you want to delete this image? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteImage.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
