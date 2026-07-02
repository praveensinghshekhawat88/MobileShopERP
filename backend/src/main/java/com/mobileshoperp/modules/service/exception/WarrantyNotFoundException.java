package com.mobileshoperp.modules.service.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;
import java.util.UUID;

public class WarrantyNotFoundException extends BaseException {

    public WarrantyNotFoundException(UUID id) {
        super(ErrorCode.RESOURCE_NOT_FOUND, "Warranty not found: " + id);
    }

    public WarrantyNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }
}
