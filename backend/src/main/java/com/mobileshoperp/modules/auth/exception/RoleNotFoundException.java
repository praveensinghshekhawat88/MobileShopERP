package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class RoleNotFoundException extends ResourceNotFoundException {

    public RoleNotFoundException(Long id) {
        super("Role not found with id: " + id);
    }
}
