package com.mobileshoperp.modules.inventory.exception;

import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;

public class InvalidStockTransitionException extends BusinessRuleException {

    public InvalidStockTransitionException(StockStatus from, StockStatus to) {
        super("Invalid stock status transition: " + from + " -> " + to);
    }
}
