package com.mobileshoperp.modules.inventory.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateImeiException extends BaseException {

    public DuplicateImeiException(String imei) {
        super(ErrorCode.CONFLICT, "IMEI already exists: " + imei);
    }
}
