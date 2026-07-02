package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(String identifier) {
        super("User not found: " + identifier);
    }
}
