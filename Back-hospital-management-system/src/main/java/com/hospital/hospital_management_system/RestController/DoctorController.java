package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/profile/{doctorId}")
    public ResponseEntity<Doctor> getMyProfile(@PathVariable Long doctorId) {
        Doctor doctor = doctorService.getMyProfile(doctorId);
        return ResponseEntity.ok(doctor);
    }
}
