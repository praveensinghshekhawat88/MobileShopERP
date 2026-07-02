package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class AttributeNotFoundException extends ResourceNotFoundException {

    public AttributeNotFoundException(Long id) {
        super("Attribute not found with id: " + id);
    }
}
