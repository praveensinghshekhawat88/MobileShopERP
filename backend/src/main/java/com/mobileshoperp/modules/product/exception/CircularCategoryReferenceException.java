package com.mobileshoperp.modules.product.exception;

import com.mobileshoperp.exception.BusinessRuleException;

public class CircularCategoryReferenceException extends BusinessRuleException {

    public CircularCategoryReferenceException() {
        super("Category cannot be assigned as its own ancestor");
    }
}
