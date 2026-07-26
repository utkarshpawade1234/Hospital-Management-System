package com.hospital.hospital_management_system.Exceptions;

public class NoSuchDoctorException extends  RuntimeException{
    public NoSuchDoctorException(String message) {
        super(message);
    }
}
