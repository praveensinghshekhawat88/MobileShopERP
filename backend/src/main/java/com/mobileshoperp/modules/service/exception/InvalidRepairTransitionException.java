package com.mobileshoperp.modules.service.exception;

import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.exception.BusinessRuleException;

public class InvalidRepairTransitionException extends BusinessRuleException {

    public InvalidRepairTransitionException(RepairStatus from, RepairStatus to) {
        super("Invalid repair status transition: " + from + " -> " + to);
    }
}
