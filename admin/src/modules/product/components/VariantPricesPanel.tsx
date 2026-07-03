import AddIcon from '@mui/icons-material/Add';
import { Chip, Stack } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { PRICE_TYPE_LABELS } from '@/common/constants/priceType';
import { AppButton } from '@/components/buttons/AppButton';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { ProductPriceFormDialog } from '@/modules/product/components/ProductPriceFormDialog';
import { useProductPrices } from '@/modules/product/hooks/useProductPrices';
import type { ProductPriceResponse } from '@/modules/product/types/Product';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

interface VariantPricesPanelProps {
  readonly variantId: string;
  readonly isAdmin: boolean;
}

/**
 * Price History tab — see 04_TASKS.md P04-T004 and AGENTS.md § Product Price
 * Rule: "Never overwrite prices. Always create new record." `GET
 * /product-prices?variantId=...` returns a plain (non-paginated) list
 * ordered `effectiveFrom DESC, createdAt DESC`; pagination here is
 * client-side over that already-small, per-variant history. There is
 * intentionally no edit/delete row action — the API is append-only.
 */
export function VariantPricesPanel({ variantId, isAdmin }: VariantPricesPanelProps): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);

  const pricesQuery = useProductPrices(variantId);
  const allPrices = pricesQuery.data ?? [];
  const pageRows = allPrices.slice(page * pageSize, page * pageSize + pageSize);

  const columns: readonly DataTableColumn<ProductPriceResponse>[] = [
    { key: 'priceType', header: 'Type', render: (row) => PRICE_TYPE_LABELS[row.priceType] },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatCurrency(row.price) },
    { key: 'effectiveFrom', header: 'Effective From', render: (row) => formatDate(row.effectiveFrom) },
    { key: 'effectiveTo', header: 'Effective To', render: (row) => formatDate(row.effectiveTo) },
    {
      key: 'active',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.active ? 'Active' : 'Closed'}
          color={row.active ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Stack spacing={2}>
      {isAdmin ? (
        <Stack direction="row" justifyContent="flex-end">
          <AppButton appVariant="primary" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            Add Price
          </AppButton>
        </Stack>
      ) : null}

      <DataTable<ProductPriceResponse>
        columns={columns}
        rows={pageRows}
        getRowId={(row) => row.id}
        loading={pricesQuery.isLoading}
        error={pricesQuery.isError ? getApiErrorMessage(pricesQuery.error) : null}
        onRetry={() => void pricesQuery.refetch()}
        emptyTitle="No price history found"
        emptyDescription={isAdmin ? 'Add the first price for this variant.' : undefined}
        page={page}
        pageSize={pageSize}
        totalCount={allPrices.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      />

      {isAdmin && formOpen ? (
        <ProductPriceFormDialog open variantId={variantId} onClose={() => setFormOpen(false)} />
      ) : null}
    </Stack>
  );
}
