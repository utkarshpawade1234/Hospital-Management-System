package com.hospital.hospital_management_system.Exceptions;

public class ApiResponse extends  RuntimeException{
    public ApiResponse(String message) {
        super(message);
    }
}
