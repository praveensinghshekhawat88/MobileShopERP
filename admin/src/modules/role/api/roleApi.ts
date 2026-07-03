/** Raw endpoint paths for roles — see `RoleController.java`. */
export const ROLE_API = {
  base: '/roles',
  byId: (id: number) => `/roles/${id}`,
} as const;
