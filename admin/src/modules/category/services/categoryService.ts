import { apiClient } from '@/config/axios';
import { CATEGORY_API } from '@/modules/category/api/categoryApi';
import type {
  CategoryResponse,
  CategoryTreeNode,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/modules/category/types/Category';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListCategoriesParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Category module service — see 03_ARCHITECTURE.md § API Architecture and
 * `CategoryController.java`. Categories are self-referencing (see AGENTS.md
 * § Category Rule); `getTree()` backs the parent picker and drives the
 * hierarchy shown across the app, while `list()` backs the paginated table.
 */
export const categoryService = {
  async list({ page, size, sortKey, sortDirection }: ListCategoriesParams): Promise<Page<CategoryResponse>> {
    const response = await apiClient.get<ApiResponse<Page<CategoryResponse>>>(CATEGORY_API.base, {
      params: { page, size, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getTree(): Promise<readonly CategoryTreeNode[]> {
    const response = await apiClient.get<ApiResponse<CategoryTreeNode[]>>(CATEGORY_API.tree);
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.post<ApiResponse<CategoryResponse>>(CATEGORY_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: number, request: UpdateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.put<ApiResponse<CategoryResponse>>(CATEGORY_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async deactivate(id: number): Promise<void> {
    await apiClient.patch<ApiResponse<null>>(CATEGORY_API.deactivate(id));
  },
};
