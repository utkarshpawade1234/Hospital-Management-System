package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.DoctorDTO;
import com.hospital.hospital_management_system.DTO.ReqAppointmentDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.Doctor;
import org.springframework.stereotype.Service;

@Service
public class CommonMethods {

    public ReqAppointmentDTO convertToAppointmentDTO(Appointment appointment) {
        ReqAppointmentDTO dto = new ReqAppointmentDTO();
        dto.setAppointmentId(appointment.getAppointmentId());

        if (appointment.getPatient() != null) {
            dto.setPatientId(appointment.getPatient().getPatientId());
            if (appointment.getPatient().getUser() != null) {
                String pFirst = appointment.getPatient().getUser().getFirstName() != null ? appointment.getPatient().getUser().getFirstName() : "";
                String pLast = appointment.getPatient().getUser().getLastName() != null ? appointment.getPatient().getUser().getLastName() : "";
                dto.setPatientName((pFirst + " " + pLast).trim());
            }
        }

        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getDoctorId());
            if (appointment.getDoctor().getUser() != null) {
                String dFirst = appointment.getDoctor().getUser().getFirstName() != null ? appointment.getDoctor().getUser().getFirstName() : "";
                String dLast = appointment.getDoctor().getUser().getLastName() != null ? appointment.getDoctor().getUser().getLastName() : "";
                dto.setDoctorName(("Dr. " + dFirst + " " + dLast).trim());
            }
        }

        if (appointment.getDepartment() != null) {
            dto.setDepartmentName(appointment.getDepartment().getDepartmentName());
        }

        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setStartTime(appointment.getStartTime());
        dto.setEndTime(appointment.getEndTime());

        if (appointment.getAppointmentType() != null) {
            dto.setAppointmentType(appointment.getAppointmentType().name());
        }

        if (appointment.getStatus() != null) {
            dto.setStatus(appointment.getStatus().name());
        }


        dto.setRemarks(appointment.getRemarks());
        return dto;
    }

    public DoctorDTO convertToDTO(Doctor doctor) {

        DoctorDTO dto = new DoctorDTO();

        dto.setFirstName(
                doctor.getUser().getFirstName());

        dto.setLastName(
                doctor.getUser().getLastName());

        dto.setEmail(
                doctor.getUser().getEmail());

        dto.setPhoneNumber(
                doctor.getUser().getContactNumber());

        dto.setProfilePhoto(
                doctor.getUser().getProfilePhoto());


        return dto;
    }

}
