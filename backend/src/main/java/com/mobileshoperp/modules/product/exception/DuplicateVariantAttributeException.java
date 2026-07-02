package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BusinessRuleException;

public class DuplicateVariantAttributeException extends BusinessRuleException {

    public DuplicateVariantAttributeException(String attributeName) {
        super("Variant already has a value assigned for attribute: " + attributeName);
    }
}
