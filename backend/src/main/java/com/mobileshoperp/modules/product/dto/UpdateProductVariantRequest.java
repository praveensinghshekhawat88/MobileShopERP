package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateProductVariantRequest(
        @Size(max = 100) String sku, @Size(max = 100) String barcode, Boolean active) {
}
