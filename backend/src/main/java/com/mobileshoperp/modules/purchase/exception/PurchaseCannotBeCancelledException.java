package com.mobileshoperp.modules.purchase.exception;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.UUID;

public class PurchaseCannotBeCancelledException extends BusinessRuleException {

    public PurchaseCannotBeCancelledException(UUID purchaseId, String reason) {
        super("Purchase cannot be cancelled: " + purchaseId + ". " + reason);
    }
}
