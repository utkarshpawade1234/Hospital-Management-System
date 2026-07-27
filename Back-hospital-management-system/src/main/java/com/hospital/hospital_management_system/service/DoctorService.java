package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.AppointmentDTO;
import com.hospital.hospital_management_system.DTO.DoctorDTO;
import com.hospital.hospital_management_system.DTO.ReqAppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import com.hospital.hospital_management_system.model.Doctor;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DoctorService {
    DoctorDTO getMyProfile(String email);

    Page<ReqAppointmentDTO> getUpcomingAppointments(String email, int page, int size);

    ResponseDTO changeStatus(String email, Doctor.AvailabilityStatus availabilityStatus);

    ResponseDTO updateMyProfile(String email, DoctorDTO doctorDTO);

    ReqAppointmentDTO getAppointmentById(String email, Long appointmentId);

    public ResponseDTO confirmAppointment(String email, Long appointmentId);

    ResponseDTO completeAppointment(String email, Long appointmentId);

    ResponseDTO cancelAppointment(String email, Long appointmentId);


}
