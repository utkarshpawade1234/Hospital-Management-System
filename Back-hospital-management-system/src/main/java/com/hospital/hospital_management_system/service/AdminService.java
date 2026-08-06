package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminService {
    Page<Patient> getAllPatients(int page, int size);

    Page<DoctorDTO> getAllDoctors(int page, int size);

    Page<ReqAppointmentDTO> getAllAppointments(int page, int size);

    ResponseDTO deleteDoctor(long doctorId);

    ResponseDTO deleteDepartment(Long departmentId);

    ResponseDTO deletePatient(Long patientId);

    ResponseDTO deleteAppointment(Long appointmentId);

    DashBoardDTO getDashBoardDetails();

    Patient getPatientById(Long patientId);

    DoctorDTO getDoctorById(Long doctorId);

    List<Department> getAllDepartments();

    DepartmentDTO getDepartmentById(Long departmentId);

    ResponseDTO addDepartment(DepartmentDTO departmentDTO);

    ResponseDTO updateDepartment(Long departmentId, DepartmentUpdateDTO departmentUpdateDTO);

    Appointment getAppointmentById(Long appointmentId);

    ResponseDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status);

     Page<DoctorDTO> getDoctorsByDepartment(Long departmentId, int page, int size);

    Page<DoctorDTO> searchDoctor(String keyword, int page, int size);

    Page<PatientDTO> searchPatient(String keyword, int page, int size);

    Page<ReqAppointmentDTO> getAppointmentsByStatus(AppointmentStatus status, int page, int size);

    Page<ReqAppointmentDTO> getAppointmentsByDoctor(Long doctorId, int page, int size);

    Page<ReqAppointmentDTO> getAppointmentsByPatient(Long patientId, int page, int size);

    ResponseDTO updateDoctorDetails(DoctorDTO doctorates);

    ResponseDTO updatePatientDetails(UpdatePatientDTO patientdetails);
}
