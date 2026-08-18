package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import jakarta.validation.Valid;

import java.util.List;

public interface PatientService {

  


    ResponseDTO registerPatientDetails(PatientDTO dto);

    ResponseDTO updatePatientDetails(UpdatePatientDTO dto);

    PatientProfileDTO getMyProfile(String email);

    List<DoctorDTO> fetchDoctorDetailsByFirstAndLastName(String firstName, String lastName);

    List<DoctorDTO> fetchDoctorDetailsBySpecialization(String specialization);

    List<DoctorDTO> fetchDoctorDetailsByDepartment(String departmentName);
}
