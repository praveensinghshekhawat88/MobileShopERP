package com.mobileshoperp.modules.auth.dto;

public record SettingsResponse(
        Long id,
        String companyName,
        String ownerName,
        String gstNumber,
        String mobile,
        String email,
        String address,
        String logo,
        String invoicePrefix) {
}
