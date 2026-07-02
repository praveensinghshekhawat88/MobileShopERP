package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class InvalidCredentialsException extends BaseException {

    public InvalidCredentialsException() {
        super(ErrorCode.UNAUTHORIZED, "Invalid mobile number or password");
    }
}
