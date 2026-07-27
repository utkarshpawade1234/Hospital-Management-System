package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {

    private Long departmentId;

    @NotBlank(message = "Department name is required")
    private String departmentName;

    @NotBlank(message = "Description is required")
    private String description;

    // Optional: IDs of doctors to assign to this department
    private List<Long> doctorIds;
}