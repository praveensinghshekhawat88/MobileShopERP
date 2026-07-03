import type { ReferenceType } from '@/common/constants/referenceType';
import { apiClient } from '@/config/axios';
import { PAYMENT_API } from '@/modules/sale/api/saleApi';
import type {
  CreatePaymentRequest,
  PaymentBalanceResponse,
  PaymentResponse,
} from '@/modules/sale/types/Sale';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/** Generic payment service — see `PaymentController.java` (utility module). */
export const paymentService = {
  async listByReference(referenceType: ReferenceType, referenceId: string): Promise<readonly PaymentResponse[]> {
    const response = await apiClient.get<ApiResponse<readonly PaymentResponse[]>>(PAYMENT_API.base, {
      params: { referenceType, referenceId },
    });
    return unwrapApiResponse(response.data);
  },

  async getBalance(referenceType: ReferenceType, referenceId: string): Promise<PaymentBalanceResponse> {
    const response = await apiClient.get<ApiResponse<PaymentBalanceResponse>>(PAYMENT_API.balance, {
      params: { referenceType, referenceId },
    });
    return unwrapApiResponse(response.data);
  },

  async create(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post<ApiResponse<PaymentResponse>>(PAYMENT_API.base, request);
    return unwrapApiResponse(response.data);
  },
};
