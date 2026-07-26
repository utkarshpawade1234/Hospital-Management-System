package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientservice;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody @Valid  RegistrationDTO registration){
        ResponseDTO resp=patientservice.registerUser(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<PatientProfileDTO> getProfile(
            @PathVariable String email) {
        PatientProfileDTO dto =
                patientservice.getMyProfile(email);

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody  @Valid LoginDTO login){
       return ResponseEntity.status(HttpStatus.OK).body(patientservice.login(login));

    }



    @PostMapping("/patient")
    public ResponseEntity<ResponseDTO> registerPatient(@RequestBody @Valid PatientDTO pto){
        ResponseDTO resp=patientservice.registerPatientDetails(pto);
        return ResponseEntity.ok(resp);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO> forgotPassowrd(@RequestBody @Valid ForgotPassDTO fto){
        ResponseDTO forg=patientservice.forgotPassword(fto);

        return ResponseEntity.ok(forg);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        ResponseDTO resp = patientservice.resetPassword(dto);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/DoctorByFirstAndLastName")
    public List<DoctorDTO> getDoctorByFirstAndLastName(@RequestBody @Valid DoctorSearchDTO name) {

        return patientservice.fetchDoctorDetailsByFirstAndLastName(name.getFirstName(),name.getLastName());
    }

    @PostMapping("/DoctorBySpecialization")
    public List<DoctorDTO> getDoctorBySpecialization(@RequestBody @Valid DoctorSearchDTO specialization){
        return patientservice.fetchDoctorDetailsBySpecialization(specialization.getSpecializatin());
    }

    @PatchMapping ("/UpdatePatientDetails")
    public ResponseEntity<ResponseDTO> updatePatientDetails(@RequestBody @Valid UpdatePatientDTO dto) {

        ResponseDTO response = patientservice.updatePatientDetails(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/DoctorByDepartment")
    public List<DoctorDTO> getDoctorsByDepartment(@RequestBody @Valid DoctorSearchDTO depSearch){
        return patientservice.fetchDoctorDetailsByDepartment(depSearch.getDepartmentName());
    }
}
