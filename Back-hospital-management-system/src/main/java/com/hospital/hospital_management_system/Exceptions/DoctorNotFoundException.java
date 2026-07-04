package com.hospital.hospital_management_system.Exceptions;

public class DoctorNotFoundException
        extends RuntimeException {

    public DoctorNotFoundException(
            String message) {

        super(message);
    }
}
