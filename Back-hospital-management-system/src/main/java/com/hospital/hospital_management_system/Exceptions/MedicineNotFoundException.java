package com.hospital.hospital_management_system.Exceptions;

public class MedicineNotFoundException extends  RuntimeException{
    public MedicineNotFoundException(String message) {
        super(message);
    }
}
