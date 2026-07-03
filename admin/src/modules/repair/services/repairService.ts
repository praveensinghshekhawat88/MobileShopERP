import type { RepairStatus } from '@/common/constants/repairStatus';
import { apiClient } from '@/config/axios';
import { REPAIR_API } from '@/modules/repair/api/repairApi';
import type {
  CreateRepairRequest,
  RepairResponse,
  UpdateRepairRequest,
  UpdateRepairStatusRequest,
} from '@/modules/repair/types/Repair';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListRepairsParams extends PageableRequest {
  readonly customerId?: string;
  readonly status?: RepairStatus;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Repair module service — see `RepairController.java`. No delete endpoint. */
export const repairService = {
  async list({
    page,
    size,
    customerId,
    status,
    sortKey,
    sortDirection,
  }: ListRepairsParams): Promise<Page<RepairResponse>> {
    const response = await apiClient.get<ApiResponse<Page<RepairResponse>>>(REPAIR_API.base, {
      params: { page, size, customerId, status, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<RepairResponse> {
    const response = await apiClient.get<ApiResponse<RepairResponse>>(REPAIR_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateRepairRequest): Promise<RepairResponse> {
    const response = await apiClient.post<ApiResponse<RepairResponse>>(REPAIR_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateRepairRequest): Promise<RepairResponse> {
    const response = await apiClient.put<ApiResponse<RepairResponse>>(REPAIR_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async updateStatus(id: string, request: UpdateRepairStatusRequest): Promise<RepairResponse> {
    const response = await apiClient.put<ApiResponse<RepairResponse>>(REPAIR_API.status(id), request);
    return unwrapApiResponse(response.data);
  },
};
