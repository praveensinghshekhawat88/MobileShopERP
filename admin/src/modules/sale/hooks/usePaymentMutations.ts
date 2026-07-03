import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { REFERENCE_TYPES } from '@/common/constants/referenceType';
import { paymentService } from '@/modules/sale/services/paymentService';
import type { CreatePaymentRequest, PaymentResponse } from '@/modules/sale/types/Sale';
import { showSuccessToast } from '@/utils/toast';

export function useCreatePayment(): UseMutationResult<PaymentResponse, unknown, CreatePaymentRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => paymentService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, request) => {
      void queryClient.invalidateQueries({ queryKey: ['payments'] });
      if (request.referenceType === REFERENCE_TYPES.SALE) {
        void queryClient.invalidateQueries({ queryKey: ['sales', 'detail', request.referenceId] });
      }
      showSuccessToast('Payment recorded successfully.');
    },
  });
}
