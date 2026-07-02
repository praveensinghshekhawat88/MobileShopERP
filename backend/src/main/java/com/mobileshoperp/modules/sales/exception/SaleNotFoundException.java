package com.mobileshoperp.modules.sales.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class SaleNotFoundException extends ResourceNotFoundException {

    public SaleNotFoundException(UUID id) {
        super("Sale not found: " + id);
    }
}
