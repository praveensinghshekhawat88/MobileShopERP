import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PaymentFormDialog } from '@/modules/sale/components/PaymentFormDialog';
import {
  TEST_PAYMENT_AMOUNT,
  TEST_SALE_ID,
} from '@/test/fixtures/salePaymentWarrantyFixtures';
import { getSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { renderWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('PaymentFormDialog', () => {
  it('submits a payment and closes after success', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <PaymentFormDialog open saleId={TEST_SALE_ID} maxAmount={TEST_PAYMENT_AMOUNT} onClose={onClose} />
    );

    const amountField = await screen.findByLabelText(/Amount/i);
    await user.clear(amountField);
    await user.type(amountField, String(TEST_PAYMENT_AMOUNT));
    await user.click(screen.getByRole('button', { name: 'Record Payment' }));

    await waitFor(() => {
      expect(getSalePaymentWarrantyMockState().payments).toHaveLength(1);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
