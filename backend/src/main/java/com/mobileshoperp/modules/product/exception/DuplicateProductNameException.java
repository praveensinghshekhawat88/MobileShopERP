package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateProductNameException extends BaseException {

    public DuplicateProductNameException(String name, Long brandId) {
        super(ErrorCode.CONFLICT, "Product name already exists for brand " + brandId + ": " + name);
    }
}
