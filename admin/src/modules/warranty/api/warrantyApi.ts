/** Raw endpoint paths for the Warranty module — see `WarrantyController.java`. */
export const WARRANTY_API = {
  base: '/warranties',
  byId: (id: string) => `/warranties/${id}`,
  bySaleItem: (saleItemId: string) => `/warranties/by-sale-item/${saleItemId}`,
  claim: (id: string) => `/warranties/${id}/claim`,
} as const;
