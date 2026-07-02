package com.mobileshoperp.modules.business.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateCustomerMobileException extends BaseException {

    public DuplicateCustomerMobileException(String mobile) {
        super(ErrorCode.CONFLICT, "Customer mobile number already registered: " + mobile);
    }
}
