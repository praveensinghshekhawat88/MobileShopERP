import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useReceivePurchase } from '@/modules/purchase/hooks/usePurchaseMutations';
import {
  TEST_IMEI,
  TEST_PURCHASE_ID,
  TEST_PURCHASE_ITEM_ID,
} from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';
import { renderHookWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('useReceivePurchase', () => {
  it('calls receive API and invalidates stock queries on success', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useReceivePurchase());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate({
      id: TEST_PURCHASE_ID,
      request: {
        lines: [{ purchaseItemId: TEST_PURCHASE_ITEM_ID, imeis: [TEST_IMEI] }],
      },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getPurchaseStockMockState().stock).toHaveLength(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stock'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stock-movements'] });
  });
});
