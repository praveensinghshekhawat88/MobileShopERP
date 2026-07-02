package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class ProductPriceNotFoundException extends ResourceNotFoundException {

    public ProductPriceNotFoundException(UUID id) {
        super("Product price not found with id: " + id);
    }

    public ProductPriceNotFoundException(String message) {
        super(message);
    }
}
