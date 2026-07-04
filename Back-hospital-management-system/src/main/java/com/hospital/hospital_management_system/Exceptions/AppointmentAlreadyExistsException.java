package com.hospital.hospital_management_system.Exceptions;

public class AppointmentAlreadyExistsException extends  RuntimeException{
    public AppointmentAlreadyExistsException(String message) {
        super(message);
    }
}
