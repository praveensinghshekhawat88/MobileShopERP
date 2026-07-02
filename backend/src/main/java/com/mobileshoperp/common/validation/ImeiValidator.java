package com.mobileshoperp.common.validation;

import com.mobileshoperp.exception.BusinessRuleException;

public final class ImeiValidator {

    private ImeiValidator() {}

    public static void validateOrThrow(String imei) {
        if (imei == null || !imei.matches("^\\d{15}$")) {
            throw new BusinessRuleException("IMEI must be a 15-digit number");
        }
    }
}
