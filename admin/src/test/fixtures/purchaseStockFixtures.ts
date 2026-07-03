import { MOVEMENT_TYPES } from '@/common/constants/movementType';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import type {
  StockMovementResponse,
  StockResponse,
  StockStatusUpdateRequest,
} from '@/modules/inventory/types/Stock';
import type {
  PurchaseItemResponse,
  PurchaseResponse,
  ReceivePurchaseRequest,
} from '@/modules/purchase/types/Purchase';
import { buildSuccessEnvelope } from '@/test/fixtures/authFixtures';
import type { Page } from '@/types/Page';

export const API_BASE = 'http://localhost:8081/api/v1';

export const TEST_SUPPLIER_ID = '44444444-4444-4444-4444-444444444444';
export const TEST_PURCHASE_ID = '11111111-1111-1111-1111-111111111111';
export const TEST_PURCHASE_ITEM_ID = '22222222-2222-2222-2222-222222222222';
export const TEST_VARIANT_ID = '33333333-3333-3333-3333-333333333333';
export const TEST_STOCK_ID = '55555555-5555-5555-5555-555555555555';
export const TEST_MOVEMENT_ID = '66666666-6666-6666-6666-666666666666';
export const TEST_IMEI = '123456789012345';

export function buildPage<T>(content: readonly T[], page = 0, size = 20): Page<T> {
  const totalElements = content.length;
  return {
    content,
    totalElements,
    totalPages: totalElements === 0 ? 0 : 1,
    number: page,
    size,
    first: page === 0,
    last: true,
    empty: totalElements === 0,
  };
}

export function buildPurchaseResponse(
  overrides: Partial<PurchaseResponse> = {}
): PurchaseResponse {
  return {
    id: TEST_PURCHASE_ID,
    supplierId: TEST_SUPPLIER_ID,
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-01-15',
    totalAmount: 25_000,
    paymentStatus: 'PENDING',
    ...overrides,
  };
}

export function buildPurchaseItemResponse(
  overrides: Partial<PurchaseItemResponse> = {}
): PurchaseItemResponse {
  return {
    id: TEST_PURCHASE_ITEM_ID,
    purchaseId: TEST_PURCHASE_ID,
    variantId: TEST_VARIANT_ID,
    quantity: 1,
    purchasePrice: 25_000,
    taxAmount: 0,
    totalAmount: 25_000,
    ...overrides,
  };
}

export function buildStockResponse(overrides: Partial<StockResponse> = {}): StockResponse {
  return {
    id: TEST_STOCK_ID,
    purchaseItemId: TEST_PURCHASE_ITEM_ID,
    variantId: TEST_VARIANT_ID,
    imei: TEST_IMEI,
    serialNumber: null,
    stockStatus: 'AVAILABLE',
    ...overrides,
  };
}

export function buildStockMovementResponse(
  overrides: Partial<StockMovementResponse> = {}
): StockMovementResponse {
  return {
    id: TEST_MOVEMENT_ID,
    stockId: TEST_STOCK_ID,
    referenceType: 'PURCHASE',
    referenceId: TEST_PURCHASE_ID,
    movementType: 'PURCHASE',
    remarks: null,
    createdAt: '2026-01-15T10:00:00.000Z',
    ...overrides,
  };
}

export function purchasesUrl(path = ''): string {
  return `${API_BASE}/purchases${path}`;
}

export function stockUrl(path = ''): string {
  return `${API_BASE}/stock${path}`;
}

export function stockMovementsUrl(path = ''): string {
  return `${API_BASE}/stock-movements${path}`;
}

/** In-memory state shared by MSW purchase/stock handlers (reset in test setup). */
export interface PurchaseStockMockState {
  received: boolean;
  stock: StockResponse[];
  movements: StockMovementResponse[];
}

export function createInitialPurchaseStockState(): PurchaseStockMockState {
  return {
    received: false,
    stock: [buildStockResponse()],
    movements: [],
  };
}

export function applyReceiveToState(
  state: PurchaseStockMockState,
  purchaseId: string,
  request: ReceivePurchaseRequest
): void {
  const imeis = request.lines[0]?.imeis ?? [];
  const stock = buildStockResponse({
    imei: imeis[0] ?? null,
  });
  const movement = buildStockMovementResponse({
    referenceId: purchaseId,
    stockId: stock.id,
  });
  state.received = true;
  state.stock = [stock];
  state.movements = [movement];
}

export function applyStatusUpdateToState(
  state: PurchaseStockMockState,
  stockId: string,
  request: StockStatusUpdateRequest
): StockResponse {
  const current = state.stock.find((item) => item.id === stockId) ?? buildStockResponse({ id: stockId });
  const updated: StockResponse = { ...current, stockStatus: request.newStatus };
  state.stock = state.stock.some((item) => item.id === stockId)
    ? state.stock.map((item) => (item.id === stockId ? updated : item))
    : [...state.stock, updated];
  state.movements = [
    ...state.movements,
    buildStockMovementResponse({
      id: `${TEST_MOVEMENT_ID}-status-${state.movements.length + 1}`,
      stockId,
      referenceType: REFERENCE_TYPES.PURCHASE,
      referenceId: stockId,
      movementType: MOVEMENT_TYPES.ADJUSTMENT,
      remarks: request.reason ?? 'Status updated',
    }),
  ];
  return updated;
}

export function envelopeJson<T>(data: T, path: string): string {
  return JSON.stringify(buildSuccessEnvelope(data, path));
}
