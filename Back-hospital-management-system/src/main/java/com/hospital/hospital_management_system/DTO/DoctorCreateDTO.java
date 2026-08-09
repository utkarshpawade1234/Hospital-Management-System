package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DoctorCreateDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Room number is required")
    private Integer roomNumber;

    private Long departmentId;

    @NotBlank(message = "Department name is required")
    private String departmentName;

    @NotNull(message = "Consultation fee is required")
    private Double consultationFee;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer yearsOfExperience;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    private String profilePhoto;

    private String description;

    private String licenseNumber;
}