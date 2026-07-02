package com.mobileshoperp.modules.purchase.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class PurchaseNotFoundException extends ResourceNotFoundException {

    public PurchaseNotFoundException(UUID id) {
        super("Purchase not found with id: " + id);
    }
}
