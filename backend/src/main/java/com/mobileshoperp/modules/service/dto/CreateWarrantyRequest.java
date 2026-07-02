package com.mobileshoperp.modules.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateWarrantyRequest(@NotNull UUID saleItemId, @NotNull @Min(1) Integer warrantyMonths) {}
