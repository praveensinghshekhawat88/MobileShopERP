import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFinalizeSale } from '@/modules/sale/hooks/useSaleMutations';
import { TEST_SALE_ID } from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { renderHookWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('useFinalizeSale', () => {
  it('finalizes a sale and invalidates related queries', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFinalizeSale());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate({ id: TEST_SALE_ID });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getSalePaymentWarrantyMockState().finalized).toBe(true);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sales'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stock-movements'] });
  });
});
