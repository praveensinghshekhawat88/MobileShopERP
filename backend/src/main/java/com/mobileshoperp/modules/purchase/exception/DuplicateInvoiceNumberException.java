package com.mobileshoperp.modules.purchase.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;

public class DuplicateInvoiceNumberException extends BaseException {

    public DuplicateInvoiceNumberException(String invoiceNumber) {
        super(ErrorCode.CONFLICT, "Purchase invoice number already exists: " + invoiceNumber);
    }
}
