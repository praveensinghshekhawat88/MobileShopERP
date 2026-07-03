/**
 * Raw endpoint paths backing the Category master — see 01_AGENTS.md § Module
 * Structure and `CategoryController.java`.
 */
export const CATEGORY_API = {
  base: '/categories',
  tree: '/categories/tree',
  byId: (id: number) => `/categories/${id}`,
  deactivate: (id: number) => `/categories/${id}/deactivate`,
} as const;
