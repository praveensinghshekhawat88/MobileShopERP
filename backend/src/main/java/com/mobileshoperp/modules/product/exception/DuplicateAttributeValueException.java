package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateAttributeValueException extends BaseException {

    public DuplicateAttributeValueException(String value, Long attributeId) {
        super(ErrorCode.CONFLICT, "Attribute value already exists for attribute " + attributeId + ": " + value);
    }
}
