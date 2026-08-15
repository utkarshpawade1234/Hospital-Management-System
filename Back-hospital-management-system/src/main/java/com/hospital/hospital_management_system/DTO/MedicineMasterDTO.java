package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MedicineMasterDTO {

    private Long medicineId;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String genericName;

    private String manufacturer;

    private String strength;

    @NotBlank(message = "Dosage form is required")
    private String dosageForm;

    private Boolean isActive;
}
