import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { resetPurchaseStockMockState } from '@/test/msw/purchaseStockHandlers';
import { resetSalePaymentWarrantyMockState } from '@/test/msw/salePaymentWarrantyHandlers';
import { server } from '@/test/msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetPurchaseStockMockState();
  resetSalePaymentWarrantyMockState();
  cleanup();
});

afterAll(() => {
  server.close();
});
