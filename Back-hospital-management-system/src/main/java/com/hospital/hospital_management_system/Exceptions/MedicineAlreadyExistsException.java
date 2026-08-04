package com.hospital.hospital_management_system.Exceptions;

public class MedicineAlreadyExistsException extends  RuntimeException{
    public MedicineAlreadyExistsException(String message) {
        super(message);
    }
}
