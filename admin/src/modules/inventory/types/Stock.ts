import type { MovementType } from '@/common/constants/movementType';
import type { ReferenceType } from '@/common/constants/referenceType';
import type { StockStatus } from '@/common/constants/stockStatus';

/** Mirrors `StockResponse.java`. */
export interface StockResponse {
  readonly id: string;
  readonly purchaseItemId: string;
  readonly variantId: string;
  readonly imei: string | null;
  readonly serialNumber: string | null;
  readonly stockStatus: StockStatus;
}

/** Mirrors `UpdateStockRequest.java` — metadata only; status uses the dedicated endpoint. */
export interface UpdateStockRequest {
  readonly imei?: string | null;
  readonly serialNumber?: string | null;
}

/** Mirrors `StockStatusUpdateRequest.java`. */
export interface StockStatusUpdateRequest {
  readonly newStatus: StockStatus;
  readonly reason?: string | null;
  readonly referenceType?: ReferenceType;
  readonly referenceId?: string;
}

/** Mirrors `StockMovementResponse.java`. */
export interface StockMovementResponse {
  readonly id: string;
  readonly stockId: string;
  readonly referenceType: ReferenceType;
  readonly referenceId: string;
  readonly movementType: MovementType;
  readonly remarks: string | null;
  readonly createdAt: string;
}
