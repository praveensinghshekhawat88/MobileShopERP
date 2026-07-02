package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class BrandNotFoundException extends ResourceNotFoundException {

    public BrandNotFoundException(Long id) {
        super("Brand not found with id: " + id);
    }
}
