package com.hospital.hospital_management_system.DTO;

import lombok.Data;

@Data
public class PrescriptionMedicineDTO {
    private Long prescriptionMedicineId;

    private Long medicineId;

    private String medicineName;

    private String dosage;

    private String frequency;

    private String duration;

    private String instructions;

    private String quantity;
}
