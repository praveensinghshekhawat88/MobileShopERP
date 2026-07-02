package com.mobileshoperp.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Size(max = 15) String mobile,
        @NotBlank @Size(max = 100) String password) {
}
