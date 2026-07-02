package com.mobileshoperp.modules.sales.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class SaleItemNotFoundException extends ResourceNotFoundException {

    public SaleItemNotFoundException(UUID id) {
        super("Sale item not found: " + id);
    }
}
