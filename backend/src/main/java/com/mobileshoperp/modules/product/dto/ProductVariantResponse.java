package com.mobileshoperp.modules.product.dto;

import java.util.UUID;

public record ProductVariantResponse(UUID id, UUID productId, String sku, String barcode, boolean active) {
}
