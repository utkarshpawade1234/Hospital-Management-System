package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientservice;

    @GetMapping("/profile/myProfile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientProfileDTO> getProfile(Principal principal) {
        String email=principal.getName();
        PatientProfileDTO dto = patientservice.getMyProfile(email);

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ResponseDTO> registerPatient(@RequestBody @Valid PatientDTO pto) {
        ResponseDTO resp = patientservice.registerPatientDetails(pto);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/DoctorByFirstAndLastName")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN','DOCTOR')")
    public List<DoctorDTO> getDoctorByFirstAndLastName(@RequestBody @Valid DoctorSearchDTO name) {

        return patientservice.fetchDoctorDetailsByFirstAndLastName(name.getFirstName(), name.getLastName());
    }

    @PostMapping("/DoctorBySpecialization")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN','DOCTOR')")
    public List<DoctorDTO> getDoctorBySpecialization(@RequestBody DoctorSearchDTO specialization) {
        String spec = specialization.getSpecialization();
        if (spec == null || spec.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return patientservice.fetchDoctorDetailsBySpecialization(spec);
    }

    @PatchMapping("/UpdatePatientDetails")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public ResponseEntity<ResponseDTO> updatePatientDetails(@RequestBody @Valid UpdatePatientDTO dto) {

        ResponseDTO response = patientservice.updatePatientDetails(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/DoctorByDepartment")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN','DOCTOR')")
    public List<DoctorDTO> getDoctorsByDepartment(@RequestBody @Valid DoctorSearchDTO depSearch) {
        return patientservice.fetchDoctorDetailsByDepartment(depSearch.getDepartmentName());
    }
}
