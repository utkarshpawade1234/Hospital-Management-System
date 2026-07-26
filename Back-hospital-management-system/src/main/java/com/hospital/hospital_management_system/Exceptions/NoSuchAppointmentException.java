package com.hospital.hospital_management_system.Exceptions;

public class NoSuchAppointmentException extends  RuntimeException{
  public NoSuchAppointmentException(String msg){
      super(msg);
  }
}
