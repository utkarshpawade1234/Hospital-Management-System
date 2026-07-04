package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class UpdatePatientDTO {
    @NotBlank
    @Email
    private String email;

    @Size(min = 2, max = 30)
    private String firstName;

    @Size(min = 2, max = 30)
    private String lastName;

    private String address;

    @Size(min = 5)
    private String password;

    @Pattern(regexp = "^[0-9]{10}$")
    private String phoneNumber;

    @Past
    private LocalDate dob;

    private String profilephoto;

    private String description;

    private String bloodGroup;

    private String emergencyContactName;

    @Pattern(regexp = "^[0-9]{10}$")
    private String emergencyContactNumber;

    private String emergencyContactRelation;


}
