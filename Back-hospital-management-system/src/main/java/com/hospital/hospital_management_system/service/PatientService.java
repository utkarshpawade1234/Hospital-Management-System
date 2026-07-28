package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.Department;
import jakarta.validation.Valid;

import java.util.List;

public interface PatientService {

    // Create patient profile
    ResponseDTO registerUser(RegistrationDTO dto);

    LoginResponseDTO login(LoginDTO dto);

    ResponseDTO forgotPassword(@Valid ForgotPassDTO dto);

    ResponseDTO resetPassword(@Valid ResetPasswordDTO dto);

    ResponseDTO registerPatientDetails(PatientDTO dto);

    ResponseDTO updatePatientDetails(UpdatePatientDTO dto);

    PatientProfileDTO getMyProfile(String email);

    List<DoctorDTO> fetchDoctorDetailsByFirstAndLastName(String firstName, String lastName);

    List<DoctorDTO> fetchDoctorDetailsBySpecialization(String specialization);

    List<DoctorDTO> fetchDoctorDetailsByDepartment(String departmentName);

    ResponseDTO deletePatient(Long patientId);


}
