package com.hospital.hospital_management_system.Exceptions;

public class PatientNotFoundException extends RuntimeException{
    public PatientNotFoundException(String msg){
        super(msg);
    }
}
