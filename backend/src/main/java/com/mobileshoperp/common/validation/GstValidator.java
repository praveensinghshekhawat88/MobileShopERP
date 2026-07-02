package com.mobileshoperp.common.validation;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.regex.Pattern;

public final class GstValidator {

    private static final Pattern GST_PATTERN = Pattern.compile(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$");

    private GstValidator() {}

    public static void validateOrThrow(String gstNumber) {
        if (gstNumber == null || gstNumber.isBlank()) {
            return;
        }
        if (!GST_PATTERN.matcher(gstNumber.trim().toUpperCase()).matches()) {
            throw new BusinessRuleException("Invalid GST number format");
        }
    }
}
