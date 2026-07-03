import type { AttributeType } from '@/common/constants/attributeType';

export type { AttributeType } from '@/common/constants/attributeType';

/**
 * Mirrors `AttributeGroupResponse.java`. No `active` field — attribute
 * groups have no soft delete (see `AttributeGroupService#delete`, a hard
 * delete).
 */
export interface AttributeGroupResponse {
  readonly id: number;
  readonly name: string;
}

/** Mirrors `CreateAttributeGroupRequest.java` (`name` is `@NotBlank @Size(max = 100)`). */
export interface CreateAttributeGroupRequest {
  readonly name: string;
}

/** Mirrors `UpdateAttributeGroupRequest.java`. */
export interface UpdateAttributeGroupRequest {
  readonly name?: string;
}

/** Mirrors `AttributeResponse.java`. No `active` field (hard delete only). */
export interface AttributeResponse {
  readonly id: number;
  readonly attributeGroupId: number;
  readonly name: string;
  readonly attributeType: AttributeType;
}

/** Mirrors `CreateAttributeRequest.java`. All three fields are `@NotNull`/`@NotBlank`. */
export interface CreateAttributeRequest {
  readonly attributeGroupId: number;
  readonly name: string;
  readonly attributeType: AttributeType;
}

/** Mirrors `UpdateAttributeRequest.java`. All fields optional (partial update). */
export interface UpdateAttributeRequest {
  readonly attributeGroupId?: number;
  readonly name?: string;
  readonly attributeType?: AttributeType;
}

/** Mirrors `AttributeValueResponse.java`. */
export interface AttributeValueResponse {
  readonly id: number;
  readonly attributeId: number;
  readonly value: string;
  readonly displayOrder: number;
  readonly active: boolean;
}

/** Mirrors `CreateAttributeValueRequest.java`. `attributeId`/`value` required. */
export interface CreateAttributeValueRequest {
  readonly attributeId: number;
  readonly value: string;
  readonly displayOrder?: number;
  readonly active?: boolean;
}

/**
 * Mirrors `UpdateAttributeValueRequest.java`. `attributeId` is intentionally
 * absent — it is not updatable via this endpoint.
 */
export interface UpdateAttributeValueRequest {
  readonly value?: string;
  readonly displayOrder?: number;
  readonly active?: boolean;
}
