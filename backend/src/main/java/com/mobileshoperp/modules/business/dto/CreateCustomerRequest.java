package com.mobileshoperp.modules.business.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 15) String mobile,
        @Email @Size(max = 150) String email,
        String address,
        @Size(max = 20) String gstNumber) {
}
