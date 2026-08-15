package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PrescriptionMedicineDTO {
    private Long prescriptionMedicineId;

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    private String medicineName;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    @NotBlank(message = "Frequency is required")
    private String frequency;

    @NotBlank(message = "Duration is required")
    private String duration;

    private String instructions;

    private String quantity;
}
