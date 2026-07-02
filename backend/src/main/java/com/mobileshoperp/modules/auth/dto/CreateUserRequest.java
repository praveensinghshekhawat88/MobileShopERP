package com.mobileshoperp.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotNull Long roleId,
        @NotBlank @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @NotBlank @Size(max = 15) String mobile,
        @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 8, max = 100) String password) {
}
