import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { STOCK_STATUSES } from '@/common/constants/stockStatus';
import { StockStatusFormDialog } from '@/modules/inventory/components/StockStatusFormDialog';
import { buildStockResponse, TEST_STOCK_ID } from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';
import { renderWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('StockStatusFormDialog', () => {
  it('submits a status transition and closes on success', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const stock = buildStockResponse({ id: TEST_STOCK_ID, stockStatus: STOCK_STATUSES.AVAILABLE });

    renderWithProviders(<StockStatusFormDialog open stock={stock} onClose={onClose} />);

    await user.type(await screen.findByLabelText('Reason (optional)'), 'Reserved for customer');
    await user.click(screen.getByRole('button', { name: 'Update Status' }));

    await waitFor(() => {
      expect(getPurchaseStockMockState().stock[0]?.stockStatus).toBe(STOCK_STATUSES.RESERVED);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
