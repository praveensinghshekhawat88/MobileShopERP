package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class AttributeValueNotFoundException extends ResourceNotFoundException {

    public AttributeValueNotFoundException(Long id) {
        super("Attribute value not found with id: " + id);
    }
}
