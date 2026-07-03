import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCreateWarranty } from '@/modules/warranty/hooks/useWarrantyMutations';
import { TEST_SALE_ITEM_ID } from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { renderHookWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('useCreateWarranty', () => {
  it('creates a warranty and invalidates warranty queries', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCreateWarranty());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate({
      saleItemId: TEST_SALE_ITEM_ID,
      warrantyMonths: 12,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getSalePaymentWarrantyMockState().warranties).toHaveLength(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['warranties'] });
  });
});
