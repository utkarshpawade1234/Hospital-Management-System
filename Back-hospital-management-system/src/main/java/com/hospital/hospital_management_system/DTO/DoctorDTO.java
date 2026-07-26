package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.Doctor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class DoctorDTO {

    private Long doctorId;

    private String firstName;

    private String lastName;

    private String email;

    @Length(max = 10)
    private String phoneNumber;

    private String profilePhoto;

    private String specialization;

    private String qualification;

    private Integer yearsOfExperience;

    private Double consultationFee;

    private String department;

    private String description;

    private Integer roomNumber;

    private Doctor.AvailabilityStatus availabilityStatus;


}