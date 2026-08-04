package com.hospital.hospital_management_system.Exceptions;

public class NoSuchPrescriptionAvailableException extends RuntimeException{
    public NoSuchPrescriptionAvailableException(String message) {
        super(message);
    }
}
