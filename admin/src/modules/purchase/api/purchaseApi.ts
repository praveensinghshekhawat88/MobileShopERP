/**
 * Raw endpoint paths backing the Purchase module — see 01_AGENTS.md § Module
 * Structure and `PurchaseController.java` / `PurchaseItemController.java`.
 */
export const PURCHASE_API = {
  base: '/purchases',
  byId: (id: string) => `/purchases/${id}`,
  receive: (id: string) => `/purchases/${id}/receive`,
  cancel: (id: string) => `/purchases/${id}/cancel`,
  items: (purchaseId: string) => `/purchases/${purchaseId}/items`,
  itemById: (purchaseId: string, itemId: string) => `/purchases/${purchaseId}/items/${itemId}`,
} as const;
