package com.mobileshoperp.modules.service.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class RepairNotFoundException extends ResourceNotFoundException {

    public RepairNotFoundException(UUID id) {
        super("Repair not found: " + id);
    }
}
