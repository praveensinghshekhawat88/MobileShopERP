package com.mobileshoperp.modules.business.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateSupplierMobileException extends BaseException {

    public DuplicateSupplierMobileException(String mobile) {
        super(ErrorCode.CONFLICT, "Supplier mobile number already registered: " + mobile);
    }
}
