package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientProfileDTO {

    // User Table
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private String phoneNumber;
    private LocalDate dob;
    private String profilephoto;

    // Patient Table
    private Long patientId;
    private String description;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactNumber;
    private String emergencyContactRelation;
}