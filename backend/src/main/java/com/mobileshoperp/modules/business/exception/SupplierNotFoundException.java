package com.mobileshoperp.modules.business.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class SupplierNotFoundException extends ResourceNotFoundException {

    public SupplierNotFoundException(UUID id) {
        super("Supplier not found with id: " + id);
    }

    public SupplierNotFoundException(String mobile) {
        super("Supplier not found with mobile: " + mobile);
    }
}
