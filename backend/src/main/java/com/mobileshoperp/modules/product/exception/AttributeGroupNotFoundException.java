package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class AttributeGroupNotFoundException extends ResourceNotFoundException {

    public AttributeGroupNotFoundException(Long id) {
        super("Attribute group not found with id: " + id);
    }
}
