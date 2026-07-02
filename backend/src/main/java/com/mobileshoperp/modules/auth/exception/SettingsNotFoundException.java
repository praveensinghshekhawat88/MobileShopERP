package com.mobileshoperp.modules.auth.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;

public class SettingsNotFoundException extends ResourceNotFoundException {

    public SettingsNotFoundException() {
        super("Shop settings not configured");
    }
}
