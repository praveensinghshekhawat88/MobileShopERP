package com.mobileshoperp.modules.product.dto;

import java.util.UUID;

public record ProductImageResponse(UUID id, UUID variantId, String imageUrl, int displayOrder) {
}
