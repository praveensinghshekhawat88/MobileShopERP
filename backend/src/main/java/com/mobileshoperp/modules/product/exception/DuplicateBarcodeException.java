package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateBarcodeException extends BaseException {

    public DuplicateBarcodeException(String barcode) {
        super(ErrorCode.CONFLICT, "Barcode already exists: " + barcode);
    }
}
