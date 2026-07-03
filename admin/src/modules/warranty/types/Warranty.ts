import type { ClaimStatus } from '@/common/constants/claimStatus';

/** Mirrors `WarrantyResponse.java`. */
export interface WarrantyResponse {
  readonly id: string;
  readonly saleItemId: string;
  readonly warrantyMonths: number;
  readonly startDate: string;
  readonly endDate: string;
  readonly claimStatus: ClaimStatus;
  readonly expired: boolean;
}

/** Mirrors `CreateWarrantyRequest.java`. */
export interface CreateWarrantyRequest {
  readonly saleItemId: string;
  readonly warrantyMonths: number;
}
