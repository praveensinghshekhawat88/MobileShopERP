package com.mobileshoperp.modules.purchase.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class PurchaseItemNotFoundException extends ResourceNotFoundException {

    public PurchaseItemNotFoundException(UUID id) {
        super("Purchase item not found with id: " + id);
    }
}
