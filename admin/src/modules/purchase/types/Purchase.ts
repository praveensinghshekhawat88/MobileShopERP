import type { PaymentStatus } from '@/common/constants/paymentStatus';

/** Mirrors `PurchaseResponse.java`. No audit fields or supplier name — resolve via supplier module. */
export interface PurchaseResponse {
  readonly id: string;
  readonly supplierId: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly totalAmount: number;
  readonly paymentStatus: PaymentStatus;
}

/** Mirrors `CreatePurchaseRequest.java`. `totalAmount` is overwritten when line items are added. */
export interface CreatePurchaseRequest {
  readonly supplierId: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly totalAmount: number;
  readonly paymentStatus?: PaymentStatus;
}

/** Mirrors `UpdatePurchaseRequest.java`. All fields optional (partial update). */
export interface UpdatePurchaseRequest {
  readonly supplierId?: string;
  readonly invoiceNumber?: string;
  readonly invoiceDate?: string;
  readonly totalAmount?: number;
  readonly paymentStatus?: PaymentStatus;
}

/** Mirrors `PurchaseItemResponse.java`. `totalAmount` is computed server-side. */
export interface PurchaseItemResponse {
  readonly id: string;
  readonly purchaseId: string;
  readonly variantId: string;
  readonly quantity: number;
  readonly purchasePrice: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
}

/** Mirrors `CreatePurchaseItemRequest.java`. */
export interface CreatePurchaseItemRequest {
  readonly variantId: string;
  readonly quantity: number;
  readonly purchasePrice: number;
  readonly taxAmount?: number;
}

/** Mirrors `UpdatePurchaseItemRequest.java`. All fields optional (partial update). */
export interface UpdatePurchaseItemRequest {
  readonly variantId?: string;
  readonly quantity?: number;
  readonly purchasePrice?: number;
  readonly taxAmount?: number;
}

/** Mirrors `ReceivePurchaseLineRequest.java`. */
export interface ReceivePurchaseLineRequest {
  readonly purchaseItemId: string;
  readonly imeis?: readonly string[];
}

/** Mirrors `ReceivePurchaseRequest.java`. Must include every line item exactly once. */
export interface ReceivePurchaseRequest {
  readonly lines: readonly ReceivePurchaseLineRequest[];
  readonly paymentStatus?: PaymentStatus;
}
