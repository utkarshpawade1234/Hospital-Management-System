package com.hospital.hospital_management_system.Exceptions;

public class PrescriptionAlreadyExistsException extends  RuntimeException{
    public PrescriptionAlreadyExistsException(String message) {
        super(message);
    }
}
