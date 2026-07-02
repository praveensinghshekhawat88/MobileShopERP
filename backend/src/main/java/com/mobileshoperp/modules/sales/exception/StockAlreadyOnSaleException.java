package com.mobileshoperp.modules.sales.exception;

import com.mobileshoperp.exception.BaseException;
import com.mobileshoperp.exception.ErrorCode;
import java.util.UUID;

public class StockAlreadyOnSaleException extends BaseException {

    public StockAlreadyOnSaleException(UUID stockId) {
        super(ErrorCode.CONFLICT, "Stock is already assigned to a sale: " + stockId);
    }
}
