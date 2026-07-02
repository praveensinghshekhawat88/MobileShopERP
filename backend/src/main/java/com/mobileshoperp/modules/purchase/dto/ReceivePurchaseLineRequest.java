package com.mobileshoperp.modules.purchase.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record ReceivePurchaseLineRequest(@NotNull UUID purchaseItemId, List<String> imeis) {
}
