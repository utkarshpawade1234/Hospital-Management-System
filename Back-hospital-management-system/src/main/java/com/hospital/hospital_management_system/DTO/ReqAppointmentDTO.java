package com.hospital.hospital_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

// TODO: Planned DTO for detailed admin appointment table view
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqAppointmentDTO {
    private Long appointmentId;

    private String patientName;
    private Long patientId;

    private String doctorName;
    private Long doctorId;

    private String departmentName;

    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String appointmentType;
    private String status;

    private String remarks;
}
