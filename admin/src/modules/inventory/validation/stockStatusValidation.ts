import { z } from 'zod';

import { STOCK_STATUSES } from '@/common/constants/stockStatus';

/** Mirrors `StockStatusUpdateRequest.java`. */
export const stockStatusFormSchema = z.object({
  newStatus: z.enum(
    [
      STOCK_STATUSES.AVAILABLE,
      STOCK_STATUSES.RESERVED,
      STOCK_STATUSES.SOLD,
      STOCK_STATUSES.REPAIR,
      STOCK_STATUSES.RETURNED,
      STOCK_STATUSES.DAMAGED,
      STOCK_STATUSES.LOST,
    ],
    { required_error: 'New status is required', invalid_type_error: 'New status is required' }
  ),
  reason: z.string().trim().optional(),
});

export type StockStatusFormValues = z.infer<typeof stockStatusFormSchema>;

export const STOCK_STATUS_FORM_DEFAULT_VALUES: StockStatusFormValues = {
  newStatus: STOCK_STATUSES.AVAILABLE,
  reason: '',
};
