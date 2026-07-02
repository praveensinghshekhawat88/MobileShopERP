package com.mobileshoperp.modules.purchase.exception;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.UUID;

public class PurchaseAlreadyReceivedException extends BusinessRuleException {

    public PurchaseAlreadyReceivedException(UUID purchaseId) {
        super("Purchase has already been received: " + purchaseId);
    }
}
