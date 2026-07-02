package com.mobileshoperp.modules.service.exception;

import com.mobileshoperp.exception.BusinessRuleException;
import java.util.UUID;

public class WarrantyExpiredException extends BusinessRuleException {

    public WarrantyExpiredException(UUID warrantyId) {
        super("Warranty has expired: " + warrantyId);
    }
}
