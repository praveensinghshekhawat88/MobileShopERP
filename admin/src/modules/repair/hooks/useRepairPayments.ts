import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { STALE_TIME } from '@/config/queryClient';
import { paymentService } from '@/modules/sale/services/paymentService';
import type { PaymentBalanceResponse, PaymentResponse } from '@/modules/sale/types/Sale';

export function useRepairPayments(repairId: string | undefined): UseQueryResult<readonly PaymentResponse[]> {
  return useQuery({
    queryKey: ['payments', 'list', REFERENCE_TYPES.REPAIR, repairId],
    queryFn: () => paymentService.listByReference(REFERENCE_TYPES.REPAIR, repairId as string),
    enabled: Boolean(repairId),
    staleTime: STALE_TIME.default,
  });
}

export function useRepairPaymentBalance(repairId: string | undefined): UseQueryResult<PaymentBalanceResponse> {
  return useQuery({
    queryKey: ['payments', 'balance', REFERENCE_TYPES.REPAIR, repairId],
    queryFn: () => paymentService.getBalance(REFERENCE_TYPES.REPAIR, repairId as string),
    enabled: Boolean(repairId),
    staleTime: STALE_TIME.default,
  });
}
