/** Mirrors `CategoryResponse.java` — see BACKEND_API_CONTRACT.md § Masters. */
export interface CategoryResponse {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
}

/**
 * Mirrors `CategoryTreeNode.java` — returned by `GET /categories/tree`
 * (active categories only, nested by `parentId`).
 */
export interface CategoryTreeNode {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
  readonly children: readonly CategoryTreeNode[];
}

/** Mirrors `CreateCategoryRequest.java`. `parentId` omitted/null means a root category. */
export interface CreateCategoryRequest {
  readonly parentId?: number | null;
  readonly name: string;
  readonly description?: string | null;
  readonly active?: boolean;
}

/** Mirrors `UpdateCategoryRequest.java`. All fields optional (partial update). */
export interface UpdateCategoryRequest {
  readonly parentId?: number | null;
  readonly name?: string;
  readonly description?: string | null;
  readonly active?: boolean;
}
