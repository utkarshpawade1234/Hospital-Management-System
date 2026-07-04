package com.hospital.hospital_management_system.Exceptions;

public class DoctorUnavailableException  extends RuntimeException {

    public DoctorUnavailableException(
            String message) {

        super(message);
    }
}
