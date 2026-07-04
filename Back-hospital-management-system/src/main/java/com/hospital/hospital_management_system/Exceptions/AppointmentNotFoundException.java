package com.hospital.hospital_management_system.Exceptions;

public class AppointmentNotFoundException  extends  RuntimeException{
    public AppointmentNotFoundException(String message) {
        super(message);
    }
}
