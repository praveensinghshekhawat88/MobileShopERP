package com.mobileshoperp.modules.inventory.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class StockMovementNotFoundException extends ResourceNotFoundException {

    public StockMovementNotFoundException(UUID id) {
        super("Stock movement not found: " + id);
    }
}
