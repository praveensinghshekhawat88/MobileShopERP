package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateAttributeNameException extends BaseException {

    public DuplicateAttributeNameException(String name, Long attributeGroupId) {
        super(
                ErrorCode.CONFLICT,
                "Attribute name already exists in group " + attributeGroupId + ": " + name);
    }
}
