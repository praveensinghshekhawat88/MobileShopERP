import { http, HttpResponse } from 'msw';

import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import type { CreatePaymentRequest, FinalizeSaleRequest } from '@/modules/sale/types/Sale';
import type { CreateWarrantyRequest } from '@/modules/warranty/types/Warranty';
import { buildSuccessEnvelope } from '@/test/fixtures/authFixtures';
import {
  applyFinalizeToState,
  applyPaymentToState,
  applyWarrantyCreateToState,
  buildPage,
  buildSaleResponse,
  computePaymentBalance,
  createInitialSalePaymentWarrantyState,
  customersUrl,
  paymentsUrl,
  salesUrl,
  TEST_CUSTOMER_ID,
  TEST_SALE_ID,
  type SalePaymentWarrantyMockState,
  warrantiesUrl,
} from '@/test/fixtures/salePaymentWarrantyFixtures';

let mockState: SalePaymentWarrantyMockState = createInitialSalePaymentWarrantyState();

export function resetSalePaymentWarrantyMockState(): void {
  mockState = createInitialSalePaymentWarrantyState();
}

export function getSalePaymentWarrantyMockState(): SalePaymentWarrantyMockState {
  return mockState;
}

export function getSaleStockMovements(): readonly StockMovementResponse[] {
  return mockState.movements;
}

export const salePaymentWarrantyHandlers = [
  http.get(salesUrl(), () =>
    HttpResponse.json(buildSuccessEnvelope(buildPage([mockState.sale]), '/api/v1/sales'))
  ),

  http.get(salesUrl(`/${TEST_SALE_ID}`), () =>
    HttpResponse.json(buildSuccessEnvelope(mockState.sale, `/api/v1/sales/${TEST_SALE_ID}`))
  ),

  http.get(salesUrl(`/${TEST_SALE_ID}/items`), () =>
    HttpResponse.json(
      buildSuccessEnvelope(mockState.saleItems, `/api/v1/sales/${TEST_SALE_ID}/items`)
    )
  ),

  http.post(salesUrl(`/${TEST_SALE_ID}/finalize`), async ({ request }) => {
    const body = (await request.json()) as FinalizeSaleRequest;
    const completion = applyFinalizeToState(mockState, body);
    return HttpResponse.json(
      buildSuccessEnvelope(completion, `/api/v1/sales/${TEST_SALE_ID}/finalize`)
    );
  }),

  http.get(paymentsUrl(), ({ request }) => {
    const url = new URL(request.url);
    const referenceType = url.searchParams.get('referenceType');
    const referenceId = url.searchParams.get('referenceId');
    const payments =
      referenceType === REFERENCE_TYPES.SALE && referenceId === TEST_SALE_ID
        ? mockState.payments
        : [];
    return HttpResponse.json(buildSuccessEnvelope(payments, '/api/v1/payments'));
  }),

  http.get(paymentsUrl('/balance'), ({ request }) => {
    const url = new URL(request.url);
    const referenceType = url.searchParams.get('referenceType');
    const referenceId = url.searchParams.get('referenceId');
    if (referenceType !== REFERENCE_TYPES.SALE || referenceId !== TEST_SALE_ID) {
      return HttpResponse.json(
        buildSuccessEnvelope(
          computePaymentBalance(buildSaleResponse(), []),
          '/api/v1/payments/balance'
        )
      );
    }
    return HttpResponse.json(
      buildSuccessEnvelope(
        computePaymentBalance(mockState.sale, mockState.payments),
        '/api/v1/payments/balance'
      )
    );
  }),

  http.post(paymentsUrl(), async ({ request }) => {
    const body = (await request.json()) as CreatePaymentRequest;
    const payment = applyPaymentToState(mockState, body);
    return HttpResponse.json(buildSuccessEnvelope(payment, '/api/v1/payments'));
  }),

  http.get(customersUrl(`/${TEST_CUSTOMER_ID}`), () =>
    HttpResponse.json(
      buildSuccessEnvelope(
        {
          id: TEST_CUSTOMER_ID,
          name: 'Test Customer',
          mobile: '9876543210',
          email: null,
          gstNumber: null,
          address: null,
        },
        `/api/v1/customers/${TEST_CUSTOMER_ID}`
      )
    )
  ),

  http.get(warrantiesUrl(), () =>
    HttpResponse.json(
      buildSuccessEnvelope(buildPage(mockState.warranties), '/api/v1/warranties')
    )
  ),

  http.post(warrantiesUrl(), async ({ request }) => {
    const body = (await request.json()) as CreateWarrantyRequest;
    const warranty = applyWarrantyCreateToState(mockState, body);
    return HttpResponse.json(buildSuccessEnvelope(warranty, '/api/v1/warranties'));
  }),
];
