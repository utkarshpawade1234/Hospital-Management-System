package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDTO {
    private Long prescriptionId;

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String notes;

    private LocalDateTime createdAt;

    @jakarta.validation.Valid
    private List<PrescriptionMedicineDTO> medicines;

    private String doctorName;

    private String patientName;

    private Long patientId;

    private LocalDate appointmentDate;
}
