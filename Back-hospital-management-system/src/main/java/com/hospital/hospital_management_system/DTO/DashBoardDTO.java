package com.hospital.hospital_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashBoardDTO {
    private Long totalPatients;

    private Long totalDoctors;

    private Long totalDepartments;

    private Long totalUsers;

    private Long totalAppointments;

    private Long pendingAppointments;

    private Long confirmedAppointments;

    private Long completedAppointments;

    private Long cancelledAppointments;



}
