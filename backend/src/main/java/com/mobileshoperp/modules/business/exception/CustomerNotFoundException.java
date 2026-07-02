package com.mobileshoperp.modules.business.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class CustomerNotFoundException extends ResourceNotFoundException {

    public CustomerNotFoundException(UUID id) {
        super("Customer not found with id: " + id);
    }

    public CustomerNotFoundException(String mobile) {
        super("Customer not found with mobile: " + mobile);
    }
}
