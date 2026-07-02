package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class ProductImageNotFoundException extends ResourceNotFoundException {

    public ProductImageNotFoundException(UUID id) {
        super("Product image not found with id: " + id);
    }
}
