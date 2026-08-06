package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorSearchDTO {
    private String firstName;
    private String lastName;
    private String specialization;
    private String specializatin;
    private String departmentName;

    public String getSpecialization() {
        if (specialization != null && !specialization.trim().isEmpty()) {
            return specialization;
        }
        return specializatin;
    }
}
