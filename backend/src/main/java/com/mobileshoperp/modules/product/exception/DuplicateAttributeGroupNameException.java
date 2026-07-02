package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateAttributeGroupNameException extends BaseException {

    public DuplicateAttributeGroupNameException(String name) {
        super(ErrorCode.CONFLICT, "Attribute group name already exists: " + name);
    }
}
