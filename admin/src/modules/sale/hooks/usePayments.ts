import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { STALE_TIME } from '@/config/queryClient';
import { paymentService } from '@/modules/sale/services/paymentService';
import type { PaymentBalanceResponse, PaymentResponse } from '@/modules/sale/types/Sale';

export function useSalePayments(saleId: string | undefined): UseQueryResult<readonly PaymentResponse[]> {
  return useQuery({
    queryKey: ['payments', 'list', REFERENCE_TYPES.SALE, saleId],
    queryFn: () => paymentService.listByReference(REFERENCE_TYPES.SALE, saleId as string),
    enabled: Boolean(saleId),
    staleTime: STALE_TIME.default,
  });
}

export function useSalePaymentBalance(saleId: string | undefined): UseQueryResult<PaymentBalanceResponse> {
  return useQuery({
    queryKey: ['payments', 'balance', saleId],
    queryFn: () => paymentService.getBalance(REFERENCE_TYPES.SALE, saleId as string),
    enabled: Boolean(saleId),
    staleTime: STALE_TIME.default,
  });
}
