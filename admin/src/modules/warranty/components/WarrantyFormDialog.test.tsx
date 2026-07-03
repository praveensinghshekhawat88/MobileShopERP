import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { WarrantyFormDialog } from '@/modules/warranty/components/WarrantyFormDialog';
import {
  buildSaleItemResponse,
  TEST_SALE_ID,
  TEST_SALE_ITEM_ID,
} from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { renderWithProviders } from '@/test/testUtils';

const stableInvoiceById = new Map([[TEST_SALE_ID, 'SAL-2026-001']]);

vi.mock('@/modules/sale/hooks/useSales', () => ({
  useSaleOptions: () => ({
    options: [{ value: TEST_SALE_ID, label: 'SAL-2026-001' }],
    invoiceById: stableInvoiceById,
    isLoading: false,
  }),
}));

vi.mock('@/modules/sale/hooks/useSaleItems', () => ({
  useSaleItems: () => ({
    data: [buildSaleItemResponse()],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('WarrantyFormDialog', () => {
  it('creates a warranty for the selected sale item', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<WarrantyFormDialog open onClose={onClose} />);

    await user.click(screen.getByLabelText('Sale Invoice'));
    await user.click(await screen.findByRole('option', { name: 'SAL-2026-001' }));

    await user.click(screen.getByLabelText('Sale Item'));
    await user.click(
      await screen.findByRole('option', {
        name: new RegExp(`${TEST_SALE_ITEM_ID.slice(0, 8)}`, 'i'),
      })
    );

    await user.click(screen.getByRole('button', { name: 'Create Warranty' }));

    await waitFor(() => {
      expect(getSalePaymentWarrantyMockState().warranties).toHaveLength(1);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
