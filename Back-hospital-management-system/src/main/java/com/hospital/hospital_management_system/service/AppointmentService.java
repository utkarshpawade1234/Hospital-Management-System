package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.AppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;

import java.util.List;

public interface AppointmentService {
    ResponseDTO bookAppointment(AppointmentDTO appointmentdto, String email);

    List<Appointment> getAllAppointmentsByPatientId(Long patientId);

    List<Appointment> getAppointmentsByDoctorId(Long doctoId);

    List<Appointment> getAllAppointments();

    List<Appointment> getAllAppointmentByPatientAndDoctorName(String firstName, String lastName);

    List<Appointment> getAllAppointmentByStatus(AppointmentStatus status);

    ResponseDTO CancelAppointment(Long AppointmentId, String email);


}
