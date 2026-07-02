package com.mobileshoperp.modules.service.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;
import java.util.UUID;

public class DuplicateWarrantyException extends BaseException {

    public DuplicateWarrantyException(UUID saleItemId) {
        super(ErrorCode.CONFLICT, "Warranty already exists for sale item: " + saleItemId);
    }
}
