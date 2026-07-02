package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateMobileException extends BaseException {

    public DuplicateMobileException(String mobile) {
        super(ErrorCode.CONFLICT, "Mobile number already registered: " + mobile);
    }
}
