package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(UUID id) {
        super("Product not found with id: " + id);
    }
}
