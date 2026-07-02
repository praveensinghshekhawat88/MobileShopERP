package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class VariantAttributeNotFoundException extends ResourceNotFoundException {

    public VariantAttributeNotFoundException(UUID id) {
        super("Variant attribute assignment not found with id: " + id);
    }
}
