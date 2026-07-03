/** Raw endpoint paths for the Repair module — see `RepairController.java`. */
export const REPAIR_API = {
  base: '/repairs',
  byId: (id: string) => `/repairs/${id}`,
  status: (id: string) => `/repairs/${id}/status`,
} as const;
