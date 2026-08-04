package com.hospital.hospital_management_system.DTO;

import lombok.Data;

@Data
public class MedicineMasterDTO {

    private Long medicineId;

    private String medicineName;

    private String genericName;

    private String manufacturer;

    private String strength;

    private String dosageForm;

    private Boolean isActive;
}
