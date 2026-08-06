package com.hospital.hospital_management_system.Exceptions;

public class PaymentVerificationException extends RuntimeException {
    public PaymentVerificationException(String message, Throwable cause) {
        super(message, cause);
    }

    public PaymentVerificationException(String message) {
        super(message);
    }
}
