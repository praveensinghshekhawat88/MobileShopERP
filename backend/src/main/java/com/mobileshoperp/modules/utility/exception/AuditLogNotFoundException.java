package com.mobileshoperp.modules.utility.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class AuditLogNotFoundException extends ResourceNotFoundException {

    public AuditLogNotFoundException(UUID id) {
        super("Audit log not found: " + id);
    }
}
