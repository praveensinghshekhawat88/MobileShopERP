package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class CategoryNotFoundException extends ResourceNotFoundException {

    public CategoryNotFoundException(Long id) {
        super("Category not found with id: " + id);
    }
}
