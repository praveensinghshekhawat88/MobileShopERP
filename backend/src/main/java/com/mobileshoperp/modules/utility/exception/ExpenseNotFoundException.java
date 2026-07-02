package com.mobileshoperp.modules.utility.exception;

import com.mobileshoperp.exception.ResourceNotFoundException;
import java.util.UUID;

public class ExpenseNotFoundException extends ResourceNotFoundException {

    public ExpenseNotFoundException(UUID id) {
        super("Expense not found: " + id);
    }
}
