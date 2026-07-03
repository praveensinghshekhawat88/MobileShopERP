import { http, HttpResponse } from 'msw';

import type { StockStatusUpdateRequest } from '@/modules/inventory/types/Stock';
import type { ReceivePurchaseRequest } from '@/modules/purchase/types/Purchase';
import { buildSuccessEnvelope } from '@/test/fixtures/authFixtures';
import {
  applyReceiveToState,
  applyStatusUpdateToState,
  buildPage,
  buildPurchaseItemResponse,
  buildPurchaseResponse,
  buildStockResponse,
  createInitialPurchaseStockState,
  purchasesUrl,
  stockMovementsUrl,
  stockUrl,
  TEST_PURCHASE_ID,
  TEST_STOCK_ID,
  type PurchaseStockMockState,
} from '@/test/fixtures/purchaseStockFixtures';
import { getSaleStockMovements } from '@/test/msw/salePaymentWarrantyHandlers';

let mockState: PurchaseStockMockState = createInitialPurchaseStockState();

export function resetPurchaseStockMockState(): void {
  mockState = createInitialPurchaseStockState();
}

export function getPurchaseStockMockState(): PurchaseStockMockState {
  return mockState;
}

const purchase = buildPurchaseResponse();
const purchaseItem = buildPurchaseItemResponse();

export const purchaseStockHandlers = [
  http.get(purchasesUrl(), () =>
    HttpResponse.json(buildSuccessEnvelope(buildPage([purchase]), '/api/v1/purchases'))
  ),

  http.get(purchasesUrl(`/${TEST_PURCHASE_ID}`), () =>
    HttpResponse.json(buildSuccessEnvelope(purchase, `/api/v1/purchases/${TEST_PURCHASE_ID}`))
  ),

  http.get(purchasesUrl(`/${TEST_PURCHASE_ID}/items`), () =>
    HttpResponse.json(
      buildSuccessEnvelope([purchaseItem], `/api/v1/purchases/${TEST_PURCHASE_ID}/items`)
    )
  ),

  http.post(purchasesUrl(`/${TEST_PURCHASE_ID}/receive`), async ({ request }) => {
    const body = (await request.json()) as ReceivePurchaseRequest;
    applyReceiveToState(mockState, TEST_PURCHASE_ID, body);
    return HttpResponse.json(
      buildSuccessEnvelope(purchase, `/api/v1/purchases/${TEST_PURCHASE_ID}/receive`)
    );
  }),

  http.get(stockUrl(), () =>
    HttpResponse.json(buildSuccessEnvelope(buildPage(mockState.stock), '/api/v1/stock'))
  ),

  http.get(stockUrl(`/${TEST_STOCK_ID}`), () => {
    const stock =
      mockState.stock.find((item) => item.id === TEST_STOCK_ID) ?? buildStockResponse();
    return HttpResponse.json(buildSuccessEnvelope(stock, `/api/v1/stock/${TEST_STOCK_ID}`));
  }),

  http.put(stockUrl(`/${TEST_STOCK_ID}/status`), async ({ request }) => {
    const body = (await request.json()) as StockStatusUpdateRequest;
    const updated = applyStatusUpdateToState(mockState, TEST_STOCK_ID, body);
    return HttpResponse.json(
      buildSuccessEnvelope(updated, `/api/v1/stock/${TEST_STOCK_ID}/status`)
    );
  }),

  http.get(stockMovementsUrl(), ({ request }) => {
    const url = new URL(request.url);
    const referenceId = url.searchParams.get('referenceId');
    const stockId = url.searchParams.get('stockId');
    let movements = [...mockState.movements, ...getSaleStockMovements()];
    if (referenceId) {
      movements = movements.filter((movement) => movement.referenceId === referenceId);
    }
    if (stockId) {
      movements = movements.filter((movement) => movement.stockId === stockId);
    }
    return HttpResponse.json(
      buildSuccessEnvelope(buildPage(movements), '/api/v1/stock-movements')
    );
  }),
];
