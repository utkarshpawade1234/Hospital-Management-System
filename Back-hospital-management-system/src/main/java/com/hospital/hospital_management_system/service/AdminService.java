package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminService {
    Page<Patient> getAllPatients(int page, int size);

    Page<DoctorDTO> getAllDoctors(int page, int size);

    Page<AppointmentDTO> getAllAppointments(int page, int size);

    Page<User> getAllUsers(int page, int size);

    ResponseDTO deleteDoctor(long doctorId);

    ResponseDTO deleteUser(Long userId);

    ResponseDTO deleteDepartment(Long departmentId);

    DashBoardDTO getDashBoardDetails();

    Patient getPatientById(Long patientId);

    DoctorDTO getDoctorById(Long doctorId);

    List<Department> getAllDepartments();

    DepartmentDTO getDepartmentById(Long departmentId);

    ResponseDTO addDepartment(DepartmentDTO departmentDTO);

    ResponseDTO updateDepartment(Long departmentId, DepartmentUpdateDTO departmentUpdateDTO);


    User getUserById(Long userId);

    Appointment getAppointmentById(Long appointmentId);

    ResponseDTO updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status);

    public Page<DoctorDTO> getDoctorsByDepartment(Long departmentId, int page, int size);

    Page<DoctorDTO> searchDoctor(
            String keyword,
            int page,
            int size);

    Page<Patient> searchPatient(
            String keyword,
            int page,
            int size);

    Page<AppointmentDTO> getAppointmentsByStatus(
            AppointmentStatus status,
            int page,
            int size);

    Page<AppointmentDTO> getAppointmentsByDoctor(
            Long doctorId,
            int page,
            int size);

    Page<AppointmentDTO> getAppointmentsByPatient(
            Long patientId,
            int page,
            int size);

    Page<User> searchUser(
            String keyword,
            int page,
            int size);
}
