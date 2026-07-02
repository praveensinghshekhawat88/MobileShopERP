package com.mobileshoperp.modules.inventory.exception;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.UUID;

public class StockNotAvailableException extends BusinessRuleException {

    public StockNotAvailableException(UUID stockId) {
        super("Stock is not available for sale: " + stockId);
    }
}
