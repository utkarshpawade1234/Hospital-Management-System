package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.PrescriptionDTO;
import com.hospital.hospital_management_system.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/doctor/appointments/{appointmentId}/prescription")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> createPrescription(Authentication authentication, @PathVariable Long appointmentId, @Valid @RequestBody PrescriptionDTO dto) {
        String doctorEmail = authentication.getName();
        PrescriptionDTO response = prescriptionService.createPrescription(doctorEmail, appointmentId, dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/appointments/{appointmentId}/prescription")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> getPrescriptionForDoctor(Authentication authentication, @PathVariable Long appointmentId) {
        String doctorEmail = authentication.getName();
        PrescriptionDTO response = prescriptionService.getDoctorPrescriptionByAppointmentId(doctorEmail, appointmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/prescriptions")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions(Authentication authentication) {
        String patientEmail = authentication.getName();
        List<PrescriptionDTO> response = prescriptionService.getPrescriptionsForPatient(patientEmail, 0, 1000).getContent();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/appointments/{appointmentId}/prescription")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PrescriptionDTO> getPatientPrescriptionByAppointmentId(Authentication authentication, @PathVariable Long appointmentId) {
        String patientEmail = authentication.getName();
        PrescriptionDTO response = prescriptionService.getPatientPrescriptionByAppointmentId(patientEmail, appointmentId);
        return ResponseEntity.ok(response);
    }
}
