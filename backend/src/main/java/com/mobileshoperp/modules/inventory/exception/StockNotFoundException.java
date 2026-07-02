package com.mobileshoperp.modules.inventory.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class StockNotFoundException extends ResourceNotFoundException {

    public StockNotFoundException(UUID id) {
        super("Stock not found with id: " + id);
    }

    public StockNotFoundException(String imei) {
        super("Stock not found with IMEI: " + imei);
    }
}
