package com.hospital.hospital_management_system.DTO;

import lombok.Data;

import java.util.List;
@Data
public class DepartmentUpdateDTO {
    private  String departmentName;
    private  String description;

    private  List<Long> addDoctorIds;
    private List<Long> removeDoctorIds;
}
