package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateRoleNameException extends BaseException {

    public DuplicateRoleNameException(String name) {
        super(ErrorCode.CONFLICT, "Role name already exists: " + name);
    }
}
