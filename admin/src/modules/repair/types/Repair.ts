import type { RepairStatus } from '@/common/constants/repairStatus';

/** Mirrors `RepairResponse.java`. */
export interface RepairResponse {
  readonly id: string;
  readonly stockId: string | null;
  readonly customerId: string;
  readonly repairStatus: RepairStatus;
  readonly issueDescription: string | null;
  readonly estimatedCost: number | null;
  readonly actualCost: number | null;
}

/** Mirrors `CreateRepairRequest.java`. `stockId` omitted for external devices. */
export interface CreateRepairRequest {
  readonly customerId: string;
  readonly stockId?: string | null;
  readonly issueDescription?: string | null;
  readonly estimatedCost?: number | null;
}

/** Mirrors `UpdateRepairRequest.java` — all fields optional. */
export interface UpdateRepairRequest {
  readonly stockId?: string | null;
  readonly customerId?: string;
  readonly issueDescription?: string | null;
  readonly estimatedCost?: number | null;
  readonly actualCost?: number | null;
}

/** Mirrors `UpdateRepairStatusRequest.java`. */
export interface UpdateRepairStatusRequest {
  readonly repairStatus: RepairStatus;
  readonly reason?: string | null;
}
