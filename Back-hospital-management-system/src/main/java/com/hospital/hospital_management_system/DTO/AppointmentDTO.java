package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class AppointmentDTO {


    @NotNull
    private Long doctorId;

    @DateTimeFormat(pattern = "dd-mm-yyy")
    private LocalDate appointmentDate;

    @DateTimeFormat(pattern = "hh-mm-ss")
    private LocalTime appointmentTime;

    private String remarks;
}