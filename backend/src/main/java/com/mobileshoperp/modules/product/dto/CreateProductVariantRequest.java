package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateProductVariantRequest(
        @NotNull UUID productId,
        @NotBlank @Size(max = 100) String sku,
        @Size(max = 100) String barcode,
        Boolean active) {
}
