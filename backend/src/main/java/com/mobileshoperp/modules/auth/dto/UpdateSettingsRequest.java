package com.mobileshoperp.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateSettingsRequest(
        @Size(max = 200) String companyName,
        @Size(max = 150) String ownerName,
        @Size(max = 20) String gstNumber,
        @Size(max = 15) String mobile,
        @Email @Size(max = 150) String email,
        String address,
        String logo,
        @Size(max = 20) String invoicePrefix) {
}
