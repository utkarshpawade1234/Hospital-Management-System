package com.hospital.hospital_management_system.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDTO  {
    private Long prescriptionId;

    private Long appointmentId;

    private String diagnosis;

    private String notes;

    private LocalDateTime createdAt;

    private List<PrescriptionMedicineDTO> medicines;

    private String doctorName;

    private String appointmentDate;
}
