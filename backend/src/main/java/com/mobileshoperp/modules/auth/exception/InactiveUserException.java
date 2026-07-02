package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class InactiveUserException extends BaseException {

    public InactiveUserException() {
        super(ErrorCode.UNAUTHORIZED, "User account is inactive");
    }
}
