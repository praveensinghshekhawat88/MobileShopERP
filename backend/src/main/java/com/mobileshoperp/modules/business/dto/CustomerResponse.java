package com.mobileshoperp.modules.business.dto;

import java.util.UUID;

public record CustomerResponse(
        UUID id, String name, String mobile, String email, String address, String gstNumber) {
}
