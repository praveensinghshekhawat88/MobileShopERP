import type { PaymentMode } from '@/common/constants/paymentMode';
import type { PaymentStatus } from '@/common/constants/paymentStatus';
import type { ReferenceType } from '@/common/constants/referenceType';

/** Mirrors `SaleResponse.java`. No audit fields or customer name — resolve via customer module. */
export interface SaleResponse {
  readonly id: string;
  readonly customerId: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `CreateSaleRequest.java`. Invoice number auto-generated if omitted. */
export interface CreateSaleRequest {
  readonly customerId: string;
  readonly invoiceNumber?: string | null;
  readonly invoiceDate: string;
  readonly totalAmount?: number;
  readonly paymentStatus?: PaymentStatus;
}

/** Mirrors `UpdateSaleRequest.java`. All fields optional (partial update). ADMIN only. */
export interface UpdateSaleRequest {
  readonly customerId?: string;
  readonly invoiceNumber?: string | null;
  readonly invoiceDate?: string;
  readonly totalAmount?: number;
  readonly paymentStatus?: PaymentStatus;
}

/** Mirrors `SaleItemResponse.java`. `lineTotal` = sellingPrice - discount + taxAmount. */
export interface SaleItemResponse {
  readonly id: string;
  readonly saleId: string;
  readonly stockId: string;
  readonly sellingPrice: number;
  readonly discount: number;
  readonly taxAmount: number;
  readonly lineTotal: number;
}

/** Mirrors `CreateSaleItemRequest.java`. `sellingPrice` defaults to active retail if omitted. */
export interface CreateSaleItemRequest {
  readonly stockId: string;
  readonly sellingPrice?: number;
  readonly discount?: number;
  readonly taxAmount?: number;
}

/** Mirrors `UpdateSaleItemRequest.java`. All fields optional (partial update). */
export interface UpdateSaleItemRequest {
  readonly sellingPrice?: number;
  readonly discount?: number;
  readonly taxAmount?: number;
}

/** Mirrors `FinalizeSaleRequest.java`. Body is optional on the endpoint. */
export interface FinalizeSaleRequest {
  readonly initialPayment?: {
    readonly paymentMode: PaymentMode;
    readonly amount: number;
    readonly transactionNumber?: string | null;
  };
}

/** Mirrors `SaleCompletionResponse.java` — returned by finalize and cancel. */
export interface SaleCompletionResponse {
  readonly saleId: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly customerId: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
  readonly amountPaid: number;
  readonly balanceDue: number;
  readonly itemCount: number;
}

/** Mirrors `CreatePaymentRequest.java`. */
export interface CreatePaymentRequest {
  readonly referenceType: ReferenceType;
  readonly referenceId: string;
  readonly paymentMode: PaymentMode;
  readonly amount: number;
  readonly transactionNumber?: string | null;
  readonly paymentDate?: string;
}

/** Mirrors `PaymentResponse.java`. */
export interface PaymentResponse {
  readonly id: string;
  readonly referenceType: ReferenceType;
  readonly referenceId: string;
  readonly paymentMode: PaymentMode;
  readonly amount: number;
  readonly transactionNumber: string | null;
  readonly paymentDate: string;
}

/** Mirrors `PaymentBalanceResponse.java`. */
export interface PaymentBalanceResponse {
  readonly referenceType: ReferenceType;
  readonly referenceId: string;
  readonly totalAmount: number;
  readonly amountPaid: number;
  readonly pendingBalance: number;
  readonly paymentStatus: PaymentStatus;
}

/** @deprecated Import from `@/modules/settings/types/Settings` — kept for backward compatibility. */
export type { SettingsResponse } from '@/modules/settings/types/Settings';
