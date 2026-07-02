package com.mobileshoperp.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        Long roleId,
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Size(max = 15) String mobile,
        @Email @Size(max = 150) String email,
        @Size(min = 8, max = 100) String password,
        Boolean active) {
}
