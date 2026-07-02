package com.mobileshoperp.modules.sales.exception;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.UUID;

public class SaleCannotBeModifiedException extends BusinessRuleException {

    public SaleCannotBeModifiedException(UUID saleId, String reason) {
        super("Sale cannot be modified: " + saleId + ". " + reason);
    }
}
