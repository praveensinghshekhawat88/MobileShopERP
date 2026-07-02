package com.mobileshoperp.modules.utility.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class PaymentNotFoundException extends ResourceNotFoundException {

    public PaymentNotFoundException(UUID id) {
        super("Payment not found: " + id);
    }
}
