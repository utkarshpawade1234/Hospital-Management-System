package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;

import com.hospital.hospital_management_system.Exceptions.PatientNotFoundException;
import com.hospital.hospital_management_system.Exceptions.UserNotFoundException;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.*;
import com.hospital.hospital_management_system.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PatientServiceImplement implements PatientService {


    private final UserRepo userrepo;
    private final CommonMethods commonMethods;
    private final PatientRepo patientrepo;
    private final EmailService emailService;
    private final ModelMapper mapper;
    private final DoctorRepo doctorrepo;
    private final DepartmentRepo departmentRepo;
    private final PasswordResetRepo resetRepo;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;


    @Override
    public ResponseDTO registerPatientDetails(PatientDTO dto) {

        User u = userrepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (patientrepo.findByUser(u).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Patient details are already registered for this user");
        }
        Patient p = mapper.map(dto, Patient.class);

        p.setUser(u);

        patientrepo.save(p);


        return new ResponseDTO(
                Role.PATIENT,
                "Patient details added successfully"
        );
    }

    @Override
    public ResponseDTO updatePatientDetails(UpdatePatientDTO dto) {

        User user = userrepo.findByEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Patient patient = patientrepo.findByUserEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient profile not found"));

        // User Table Updates
        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());

        if (dto.getDob() != null)
            user.setDob(dto.getDob());

        if (dto.getAddress() != null)
            user.setAddress(dto.getAddress());

        if (dto.getPassword() != null)
            user.setPassword(dto.getPassword());

        if (dto.getProfilephoto() != null)
            user.setProfilePhoto(dto.getProfilephoto());

        if (dto.getPhoneNumber() != null)
            user.setContactNumber(dto.getPhoneNumber());


        // Patient Table Updates
        if (dto.getDescription() != null)
            patient.setDescription(dto.getDescription());

        if (dto.getBloodGroup() != null)
            patient.setBloodGroup(dto.getBloodGroup());

        if (dto.getEmergencyContactName() != null)
            patient.setEmergencyContactName(
                    dto.getEmergencyContactName());

        if (dto.getEmergencyContactNumber() != null)
            patient.setEmergencyContactNumber(
                    dto.getEmergencyContactNumber());

        if (dto.getEmergencyContactRelation() != null)
            patient.setEmergencyContactRelation(
                    dto.getEmergencyContactRelation());


        return new ResponseDTO(

                user.getUser_role(),
                "Profile Updated Successfully"
        );
    }

    @Override
    public PatientProfileDTO getMyProfile(String email) {

        User user = userrepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        PatientProfileDTO dto = mapper.map(user, PatientProfileDTO.class);
        dto.setPhoneNumber(user.getContactNumber());

        java.util.Optional<Patient> patientOpt = patientrepo.findByUser(user);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            dto.setPatientId(patient.getPatientId());
            dto.setDescription(patient.getDescription());
            dto.setBloodGroup(patient.getBloodGroup());
            dto.setEmergencyContactName(patient.getEmergencyContactName());
            dto.setEmergencyContactNumber(patient.getEmergencyContactNumber());
            dto.setEmergencyContactRelation(patient.getEmergencyContactRelation());
        }

        return dto;
    }

    @Override
    public List<DoctorDTO> fetchDoctorDetailsByFirstAndLastName(String firstName, String lastName) {
        List<Doctor> doctors = doctorrepo.findByUserFirstNameStartingWithIgnoreCaseOrUserLastNameStartingWithIgnoreCase(firstName, lastName);
        return doctors.stream().map(commonMethods::convertToDTO).toList();
    }

    @Override
    public List<DoctorDTO> fetchDoctorDetailsBySpecialization(String specialization) {
        if (specialization == null || specialization.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        List<Doctor> doctors = doctorrepo.findBySpecializationStartingWithIgnoreCase(specialization);
        return doctors.stream().map(commonMethods::convertToDTO).toList();
    }

    @Override
    public List<DoctorDTO> fetchDoctorDetailsByDepartment(String departmentName) {
        java.util.Optional<Department> dept = departmentRepo.findBydepartmentNameIgnoreCase(departmentName);
        return dept.map(department -> department.getDoctors().stream().map(commonMethods::convertToDTO).toList()).orElse(java.util.Collections.emptyList());
    }

    @Override
    public ResponseDTO deletePatient(Long patientId) {

        Patient patient = patientrepo.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("No such Patient Found"));

        Long userId = patient.getUser().getUser_id();

        patientrepo.delete(patient);

        userrepo.deleteById(userId);

        return new ResponseDTO(

                Role.PATIENT,
                "Patient Deleted Successfully"
        );
    }


}
