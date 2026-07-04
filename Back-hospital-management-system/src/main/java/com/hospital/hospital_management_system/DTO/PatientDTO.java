package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class PatientDTO {

    @NotBlank
    @Email
    private String email;

    private String description;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String emergencyContactName;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String emergencyContactNumber;

    @NotBlank
    private String emergencyContactRelation;
}
