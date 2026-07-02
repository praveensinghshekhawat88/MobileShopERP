package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class ProductVariantNotFoundException extends ResourceNotFoundException {

    public ProductVariantNotFoundException(UUID id) {
        super("Product variant not found with id: " + id);
    }
}
