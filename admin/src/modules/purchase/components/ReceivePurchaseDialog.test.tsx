import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ReceivePurchaseDialog } from '@/modules/purchase/components/ReceivePurchaseDialog';
import {
  buildPurchaseItemResponse,
  TEST_IMEI,
  TEST_PURCHASE_ID,
  TEST_VARIANT_ID,
} from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';
import { renderWithProviders } from '@/test/testUtils';

/** Stable reference — a new Map each render retriggers useEffect and loops forever. */
const stableSkuById = new Map([[TEST_VARIANT_ID, 'SKU-001']]);

vi.mock('@/modules/product', () => ({
  useProductVariantOptions: () => ({
    options: [],
    skuById: stableSkuById,
    isLoading: false,
  }),
}));

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('ReceivePurchaseDialog', () => {
  it('submits IMEIs and closes after a successful receive', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const items = [buildPurchaseItemResponse()];

    renderWithProviders(
      <ReceivePurchaseDialog
        open
        purchaseId={TEST_PURCHASE_ID}
        items={items}
        onClose={onClose}
      />
    );

    const imeiField = await screen.findByLabelText('IMEI 1 (optional)');
    await user.type(imeiField, TEST_IMEI);
    await user.click(screen.getByRole('button', { name: 'Receive & Create Stock' }));

    await waitFor(() => {
      expect(getPurchaseStockMockState().received).toBe(true);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
