package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateSkuException extends BaseException {

    public DuplicateSkuException(String sku) {
        super(ErrorCode.CONFLICT, "SKU already exists: " + sku);
    }
}
