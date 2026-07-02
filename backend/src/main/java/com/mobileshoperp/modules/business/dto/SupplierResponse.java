package com.mobileshoperp.modules.business.dto;

import java.util.UUID;

public record SupplierResponse(
        UUID id,
        String supplierName,
        String contactPerson,
        String mobile,
        String email,
        String gstNumber,
        String address) {
}
