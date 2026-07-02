package com.mobileshoperp.exception;

public class BusinessRuleException extends BaseException {

    public BusinessRuleException(String message) {
        super(ErrorCode.BUSINESS_RULE_VIOLATION, message);
    }
}
