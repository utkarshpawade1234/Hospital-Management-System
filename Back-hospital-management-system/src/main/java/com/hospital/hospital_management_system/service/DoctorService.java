package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import com.hospital.hospital_management_system.model.Doctor;

import java.util.List;

public interface DoctorService {
    Doctor getMyProfile(Long doctorId);

    List<Appointment> getUpcomingAppointments(Long doctorId);

    ResponseDTO pendingAppointmentApproval(Long AppointmentId,AppointmentStatus appointment);

    ResponseDTO changeStatus(Long doctorId,Doctor.AvailabilityStatus availabilityStatus);


}
