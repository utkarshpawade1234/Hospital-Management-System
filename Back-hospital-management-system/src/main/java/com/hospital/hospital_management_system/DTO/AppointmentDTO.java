package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.model.Patient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Setter
@Getter
public class AppointmentDTO {

    @NotNull(message = "Please Enter the patient Details")

    private Long patientId;

    @NotNull

    private Long doctorId;

    @DateTimeFormat(pattern = "dd-mm-yyy")
    private LocalDate appointmentDate;

    @DateTimeFormat(pattern = "hh-mm-ss")
    private LocalTime appointmentTime;

    private String remarks;
}