import type { AttributeType } from '@/common/constants/attributeType';
import type { PriceType } from '@/common/constants/priceType';

/** Mirrors `ProductResponse.java`. `brandId`/`categoryId` are scalar FKs (no nested objects). */
export interface ProductResponse {
  readonly id: string;
  readonly brandId: number;
  readonly categoryId: number;
  readonly name: string;
  readonly model: string | null;
  readonly hsnCode: string | null;
  readonly description: string | null;
  readonly active: boolean;
}

/** Mirrors `CreateProductRequest.java`. `name` `@NotBlank @Size(max = 200)`. */
export interface CreateProductRequest {
  readonly brandId: number;
  readonly categoryId: number;
  readonly name: string;
  readonly model?: string | null;
  readonly hsnCode?: string | null;
  readonly description?: string | null;
  readonly active?: boolean;
}

/** Mirrors `UpdateProductRequest.java`. All fields optional (partial update). */
export interface UpdateProductRequest {
  readonly brandId?: number;
  readonly categoryId?: number;
  readonly name?: string;
  readonly model?: string | null;
  readonly hsnCode?: string | null;
  readonly description?: string | null;
  readonly active?: boolean;
}

/**
 * Mirrors `ProductVariantResponse.java`. No IMEI/price/image fields — those
 * live on `stock`, `product_prices`, and `product_images` respectively
 * (see AGENTS.md § Product Structure and § Stock Rule).
 */
export interface ProductVariantResponse {
  readonly id: string;
  readonly productId: string;
  readonly sku: string;
  readonly barcode: string | null;
  readonly active: boolean;
}

/** Mirrors `CreateProductVariantRequest.java`. `sku` is `@NotBlank`, globally unique. */
export interface CreateProductVariantRequest {
  readonly productId: string;
  readonly sku: string;
  readonly barcode?: string | null;
  readonly active?: boolean;
}

/** Mirrors `UpdateProductVariantRequest.java`. All fields optional (partial update). */
export interface UpdateProductVariantRequest {
  readonly sku?: string;
  readonly barcode?: string | null;
  readonly active?: boolean;
}

/** Mirrors `ProductImageResponse.java`. No `isPrimary` flag — `displayOrder` (lowest first) drives ordering. */
export interface ProductImageResponse {
  readonly id: string;
  readonly variantId: string;
  readonly imageUrl: string;
  readonly displayOrder: number;
}

/** Mirrors `CreateProductImageRequest.java`. `imageUrl` `@NotBlank`; backend also validates the file extension. */
export interface CreateProductImageRequest {
  readonly imageUrl: string;
  readonly displayOrder?: number;
}

/** Mirrors `UpdateProductImageRequest.java`. Both fields optional (partial update). */
export interface UpdateProductImageRequest {
  readonly imageUrl?: string;
  readonly displayOrder?: number;
}

/**
 * Mirrors `ProductPriceResponse.java` — see AGENTS.md § Product Price Rule:
 * "Never overwrite prices. Always create new record." This module never
 * exposes update/delete for prices; only `POST` (append-only history).
 */
export interface ProductPriceResponse {
  readonly id: string;
  readonly variantId: string;
  readonly priceType: PriceType;
  readonly price: number;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly active: boolean;
}

/** Mirrors `CreateProductPriceRequest.java`. `price` `@NotNull @Positive`. */
export interface CreateProductPriceRequest {
  readonly variantId: string;
  readonly priceType: PriceType;
  readonly price: number;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string | null;
  readonly active?: boolean;
}

/**
 * Mirrors `VariantAttributeDetailResponse.java` — the resolved, display-ready
 * shape (attribute/group names + type) returned for a variant's assigned
 * attribute values (see AGENTS.md § Attribute Engine).
 */
export interface VariantAttributeDetailResponse {
  readonly id: string;
  readonly variantId: string;
  readonly attributeValueId: number;
  readonly attributeId: number;
  readonly attributeName: string;
  readonly attributeGroupId: number;
  readonly attributeGroupName: string;
  readonly attributeType: AttributeType;
  readonly value: string;
}

/** Mirrors `CreateVariantAttributeRequest.java` — assigns a single attribute value to a variant. */
export interface CreateVariantAttributeRequest {
  readonly variantId: string;
  readonly attributeValueId: number;
}
