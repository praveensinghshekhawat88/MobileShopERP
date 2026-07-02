package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateEmailException extends BaseException {

    public DuplicateEmailException(String email) {
        super(ErrorCode.CONFLICT, "Email already registered: " + email);
    }
}
