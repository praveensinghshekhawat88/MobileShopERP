import { CLAIM_STATUSES } from '@/common/constants/claimStatus';
import { MOVEMENT_TYPES } from '@/common/constants/movementType';
import { PAYMENT_MODES } from '@/common/constants/paymentMode';
import { PAYMENT_STATUSES } from '@/common/constants/paymentStatus';
import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import type {
  CreatePaymentRequest,
  FinalizeSaleRequest,
  PaymentBalanceResponse,
  PaymentResponse,
  SaleCompletionResponse,
  SaleItemResponse,
  SaleResponse,
} from '@/modules/sale/types/Sale';
import type { CreateWarrantyRequest, WarrantyResponse } from '@/modules/warranty/types/Warranty';
import { buildSuccessEnvelope } from '@/test/fixtures/authFixtures';
import { buildPage } from '@/test/fixtures/purchaseStockFixtures';
import type { Page } from '@/types/Page';

export const TEST_SALE_ID = 'a1111111-1111-1111-1111-111111111111';
export const TEST_SALE_ITEM_ID = 'a2222222-2222-2222-2222-222222222222';
export const TEST_CUSTOMER_ID = 'a3333333-3333-3333-3333-333333333333';
export const TEST_SALE_STOCK_ID = 'a4444444-4444-4444-4444-444444444444';
export const TEST_PAYMENT_ID = 'a5555555-5555-5555-5555-555555555555';
export const TEST_WARRANTY_ID = 'a6666666-6666-6666-6666-666666666666';
export const TEST_SALE_MOVEMENT_ID = 'a7777777-7777-7777-7777-777777777777';

export const TEST_SALE_TOTAL = 30_000;
export const TEST_PAYMENT_AMOUNT = 30_000;

export function salesUrl(path = ''): string {
  return `http://localhost:8081/api/v1/sales${path}`;
}

export function paymentsUrl(path = ''): string {
  return `http://localhost:8081/api/v1/payments${path}`;
}

export function warrantiesUrl(path = ''): string {
  return `http://localhost:8081/api/v1/warranties${path}`;
}

export function customersUrl(path = ''): string {
  return `http://localhost:8081/api/v1/customers${path}`;
}

export function buildSaleResponse(overrides: Partial<SaleResponse> = {}): SaleResponse {
  return {
    id: TEST_SALE_ID,
    customerId: TEST_CUSTOMER_ID,
    invoiceNumber: 'SAL-2026-001',
    invoiceDate: '2026-01-20',
    totalAmount: TEST_SALE_TOTAL,
    paymentStatus: PAYMENT_STATUSES.PENDING,
    ...overrides,
  };
}

export function buildSaleItemResponse(overrides: Partial<SaleItemResponse> = {}): SaleItemResponse {
  return {
    id: TEST_SALE_ITEM_ID,
    saleId: TEST_SALE_ID,
    stockId: TEST_SALE_STOCK_ID,
    sellingPrice: TEST_SALE_TOTAL,
    discount: 0,
    taxAmount: 0,
    lineTotal: TEST_SALE_TOTAL,
    ...overrides,
  };
}

export function buildPaymentResponse(overrides: Partial<PaymentResponse> = {}): PaymentResponse {
  return {
    id: TEST_PAYMENT_ID,
    referenceType: REFERENCE_TYPES.SALE,
    referenceId: TEST_SALE_ID,
    paymentMode: PAYMENT_MODES.CASH,
    amount: TEST_PAYMENT_AMOUNT,
    transactionNumber: null,
    paymentDate: '2026-01-20T10:00:00.000Z',
    ...overrides,
  };
}

export function buildSaleMovementResponse(
  overrides: Partial<StockMovementResponse> = {}
): StockMovementResponse {
  return {
    id: TEST_SALE_MOVEMENT_ID,
    stockId: TEST_SALE_STOCK_ID,
    referenceType: REFERENCE_TYPES.SALE,
    referenceId: TEST_SALE_ID,
    movementType: MOVEMENT_TYPES.SALE,
    remarks: null,
    createdAt: '2026-01-20T10:00:00.000Z',
    ...overrides,
  };
}

export function buildWarrantyResponse(overrides: Partial<WarrantyResponse> = {}): WarrantyResponse {
  return {
    id: TEST_WARRANTY_ID,
    saleItemId: TEST_SALE_ITEM_ID,
    warrantyMonths: 12,
    startDate: '2026-01-20',
    endDate: '2027-01-20',
    claimStatus: CLAIM_STATUSES.ACTIVE,
    expired: false,
    ...overrides,
  };
}

export function buildSaleCompletionResponse(
  overrides: Partial<SaleCompletionResponse> = {}
): SaleCompletionResponse {
  return {
    saleId: TEST_SALE_ID,
    invoiceNumber: 'SAL-2026-001',
    invoiceDate: '2026-01-20',
    customerId: TEST_CUSTOMER_ID,
    totalAmount: TEST_SALE_TOTAL,
    paymentStatus: PAYMENT_STATUSES.PENDING,
    amountPaid: 0,
    balanceDue: TEST_SALE_TOTAL,
    itemCount: 1,
    ...overrides,
  };
}

export interface SalePaymentWarrantyMockState {
  sale: SaleResponse;
  saleItems: SaleItemResponse[];
  finalized: boolean;
  movements: StockMovementResponse[];
  payments: PaymentResponse[];
  warranties: WarrantyResponse[];
}

export function createInitialSalePaymentWarrantyState(): SalePaymentWarrantyMockState {
  return {
    sale: buildSaleResponse(),
    saleItems: [buildSaleItemResponse()],
    finalized: false,
    movements: [],
    payments: [],
    warranties: [],
  };
}

export function computePaymentBalance(
  sale: SaleResponse,
  payments: readonly PaymentResponse[]
): PaymentBalanceResponse {
  const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingBalance = Math.max(0, sale.totalAmount - amountPaid);
  let paymentStatus = PAYMENT_STATUSES.PENDING;
  if (amountPaid >= sale.totalAmount) {
    paymentStatus = PAYMENT_STATUSES.PAID;
  } else if (amountPaid > 0) {
    paymentStatus = PAYMENT_STATUSES.PARTIAL;
  }

  return {
    referenceType: REFERENCE_TYPES.SALE,
    referenceId: sale.id,
    totalAmount: sale.totalAmount,
    amountPaid,
    pendingBalance,
    paymentStatus,
  };
}

export function applyFinalizeToState(
  state: SalePaymentWarrantyMockState,
  request?: FinalizeSaleRequest
): SaleCompletionResponse {
  state.finalized = true;
  state.movements = [buildSaleMovementResponse()];

  if (request?.initialPayment && request.initialPayment.amount > 0) {
    const payment = buildPaymentResponse({
      paymentMode: request.initialPayment.paymentMode,
      amount: request.initialPayment.amount,
      transactionNumber: request.initialPayment.transactionNumber ?? null,
    });
    state.payments = [...state.payments, payment];
  }

  const balance = computePaymentBalance(state.sale, state.payments);
  state.sale = { ...state.sale, paymentStatus: balance.paymentStatus };

  return buildSaleCompletionResponse({
    paymentStatus: balance.paymentStatus,
    amountPaid: balance.amountPaid,
    balanceDue: balance.pendingBalance,
  });
}

export function applyPaymentToState(
  state: SalePaymentWarrantyMockState,
  request: CreatePaymentRequest
): PaymentResponse {
  const payment = buildPaymentResponse({
    id: `${TEST_PAYMENT_ID}-${state.payments.length + 1}`,
    referenceType: request.referenceType,
    referenceId: request.referenceId,
    paymentMode: request.paymentMode,
    amount: request.amount,
    transactionNumber: request.transactionNumber ?? null,
    paymentDate: request.paymentDate ?? '2026-01-20T10:00:00.000Z',
  });
  state.payments = [...state.payments, payment];

  if (request.referenceType === REFERENCE_TYPES.SALE && request.referenceId === state.sale.id) {
    const balance = computePaymentBalance(state.sale, state.payments);
    state.sale = { ...state.sale, paymentStatus: balance.paymentStatus };
  }

  return payment;
}

export function applyWarrantyCreateToState(
  state: SalePaymentWarrantyMockState,
  request: CreateWarrantyRequest
): WarrantyResponse {
  const warranty = buildWarrantyResponse({
    id: `${TEST_WARRANTY_ID}-${state.warranties.length + 1}`,
    saleItemId: request.saleItemId,
    warrantyMonths: request.warrantyMonths,
  });
  state.warranties = [...state.warranties, warranty];
  return warranty;
}

export function envelopeJson<T>(data: T, path: string): string {
  return JSON.stringify(buildSuccessEnvelope(data, path));
}

export { buildPage };
export type { Page };
