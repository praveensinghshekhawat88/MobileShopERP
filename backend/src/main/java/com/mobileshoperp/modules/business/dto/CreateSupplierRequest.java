package com.mobileshoperp.modules.business.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSupplierRequest(
        @NotBlank @Size(max = 200) String supplierName,
        @Size(max = 150) String contactPerson,
        @NotBlank @Size(max = 15) String mobile,
        @Email @Size(max = 150) String email,
        @Size(max = 20) String gstNumber,
        String address) {
}
