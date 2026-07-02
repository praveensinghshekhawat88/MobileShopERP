package com.mobileshoperp.modules.sales.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;
import java.util.UUID;

public class DuplicateSaleInvoiceNumberException extends BaseException {

    public DuplicateSaleInvoiceNumberException(String invoiceNumber) {
        super(ErrorCode.CONFLICT, "Sale invoice number already exists: " + invoiceNumber);
    }
}
