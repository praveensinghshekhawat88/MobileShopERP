import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { STOCK_STATUSES } from '@/common/constants/stockStatus';
import { useUpdateStockStatus } from '@/modules/inventory/hooks/useStockMutations';
import { TEST_STOCK_ID } from '@/test/fixtures/purchaseStockFixtures';
import { getPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';
import { renderHookWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('useUpdateStockStatus', () => {
  it('updates status and invalidates stock queries', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useUpdateStockStatus());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate({
      id: TEST_STOCK_ID,
      request: { newStatus: STOCK_STATUSES.REPAIR, reason: 'Screen replacement' },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getPurchaseStockMockState().stock[0]?.stockStatus).toBe(STOCK_STATUSES.REPAIR);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stock'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stock-movements'] });
  });
});
