package com.mobileshoperp.modules.inventory.dto;

import com.mobileshoperp.common.enums.StockStatus;
import java.util.UUID;

public record StockResponse(
        UUID id,
        UUID purchaseItemId,
        UUID variantId,
        String imei,
        String serialNumber,
        StockStatus stockStatus) {
}
