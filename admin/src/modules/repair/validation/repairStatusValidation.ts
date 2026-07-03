import { z } from 'zod';

import { REPAIR_STATUSES } from '@/common/constants/repairStatus';

export const repairStatusFormSchema = z.object({
  repairStatus: z.enum([
    REPAIR_STATUSES.RECEIVED,
    REPAIR_STATUSES.CHECKING,
    REPAIR_STATUSES.WAITING_PARTS,
    REPAIR_STATUSES.REPAIRING,
    REPAIR_STATUSES.READY,
    REPAIR_STATUSES.DELIVERED,
    REPAIR_STATUSES.CANCELLED,
  ]),
  reason: z.string().trim().max(500, 'Reason must be at most 500 characters').optional(),
});

export type RepairStatusFormValues = z.infer<typeof repairStatusFormSchema>;

export const REPAIR_STATUS_FORM_DEFAULT_VALUES: RepairStatusFormValues = {
  repairStatus: REPAIR_STATUSES.RECEIVED,
  reason: '',
};
