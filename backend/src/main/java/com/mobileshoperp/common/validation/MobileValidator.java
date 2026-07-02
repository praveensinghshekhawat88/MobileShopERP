package com.mobileshoperp.common.validation;

import com.mobileshoperp.exception.BusinessRuleException;

public final class MobileValidator {

    private MobileValidator() {}

    public static void validateOrThrow(String mobile) {
        if (mobile == null || !mobile.matches("^[6-9]\\d{9}$")) {
            throw new BusinessRuleException("Mobile number must be a valid 10-digit Indian number");
        }
    }
}
