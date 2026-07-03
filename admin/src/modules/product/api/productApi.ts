/**
 * Raw endpoint paths backing the Product module — see 01_AGENTS.md § Module
 * Structure and `ProductController.java` / `ProductVariantController.java` /
 * `ProductImageController.java` / `ProductPriceController.java` /
 * `VariantAttributeController.java`. One module covers all five resources
 * (see AGENTS.md § Product Structure: Brand → Category → Product → Variant →
 * Attributes → Prices → Stock).
 */
export const PRODUCT_API = {
  base: '/products',
  byId: (id: string) => `/products/${id}`,
  deactivate: (id: string) => `/products/${id}/deactivate`,
} as const;

export const PRODUCT_VARIANT_API = {
  base: '/product-variants',
  byId: (id: string) => `/product-variants/${id}`,
  deactivate: (id: string) => `/product-variants/${id}/deactivate`,
} as const;

export const PRODUCT_IMAGE_API = {
  base: (variantId: string) => `/variants/${variantId}/images`,
  byId: (variantId: string, imageId: string) => `/variants/${variantId}/images/${imageId}`,
} as const;

export const PRODUCT_PRICE_API = {
  base: '/product-prices',
  activeRetail: '/product-prices/active-retail',
  byId: (id: string) => `/product-prices/${id}`,
} as const;

export const VARIANT_ATTRIBUTE_API = {
  base: '/variant-attributes',
  byId: (id: string) => `/variant-attributes/${id}`,
} as const;
