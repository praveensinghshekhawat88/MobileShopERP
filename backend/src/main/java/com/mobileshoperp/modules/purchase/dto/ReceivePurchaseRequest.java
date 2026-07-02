package com.mobileshoperp.modules.purchase.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record ReceivePurchaseRequest(
        @NotEmpty @Valid List<ReceivePurchaseLineRequest> lines, PaymentStatus paymentStatus) {
}
