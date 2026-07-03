import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PAYMENT_MODES } from '@/common/constants/paymentMode';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { useCreatePayment } from '@/modules/sale/hooks/usePaymentMutations';
import {
  TEST_PAYMENT_AMOUNT,
  TEST_SALE_ID,
} from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { renderHookWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('useCreatePayment', () => {
  it('records a payment and invalidates sale detail queries', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCreatePayment());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate({
      referenceType: REFERENCE_TYPES.SALE,
      referenceId: TEST_SALE_ID,
      paymentMode: PAYMENT_MODES.CASH,
      amount: TEST_PAYMENT_AMOUNT,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getSalePaymentWarrantyMockState().payments).toHaveLength(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['payments'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['sales', 'detail', TEST_SALE_ID] });
  });
});
