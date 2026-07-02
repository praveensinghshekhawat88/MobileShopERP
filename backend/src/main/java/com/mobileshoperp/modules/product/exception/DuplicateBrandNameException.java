package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateBrandNameException extends BaseException {

    public DuplicateBrandNameException(String name) {
        super(ErrorCode.CONFLICT, "Brand name already exists: " + name);
    }
}
