package com.mobileshoperp.modules.inventory.dto;

import jakarta.validation.constraints.Size;

public record UpdateStockRequest(
        @Size(max = 30) String imei,
        @Size(max = 100) String serialNumber) {
}
