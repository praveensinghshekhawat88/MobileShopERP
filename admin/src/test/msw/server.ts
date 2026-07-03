import { setupServer } from 'msw/node';

import { authHandlers } from '@/test/msw/handlers';
import { purchaseStockHandlers } from '@/test/msw/purchaseStockHandlers';
import { salePaymentWarrantyHandlers } from '@/test/msw/salePaymentWarrantyHandlers';

export const server = setupServer(...authHandlers, ...purchaseStockHandlers, ...salePaymentWarrantyHandlers);
