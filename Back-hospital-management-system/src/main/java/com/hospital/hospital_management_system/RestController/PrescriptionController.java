package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.PrescriptionDTO;
import com.hospital.hospital_management_system.Exceptions.NoSuchAppointmentException;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.repository.AppointmentRepo;
import com.hospital.hospital_management_system.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppointmentRepo appointmentRepository;

    @PostMapping("/doctor/appointments/{appointmentId}/prescription")
    public ResponseEntity<PrescriptionDTO> createPrescription(
            Authentication authentication,
            @PathVariable Long appointmentId,
            @RequestBody PrescriptionDTO dto) {

        String doctorEmail = authentication.getName();
        PrescriptionDTO response = prescriptionService.createPrescription(doctorEmail, appointmentId, dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/appointments/{appointmentId}/prescription")
    public ResponseEntity<PrescriptionDTO> getPrescriptionForDoctor(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String doctorEmail = authentication.getName();
        appointmentRepository.findByDoctorUserEmailAndAppointmentId(doctorEmail, appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

        PrescriptionDTO response = prescriptionService.getPrescriptionByAppointmentId(appointmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/prescriptions")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions(
            Authentication authentication) {

        String patientEmail = authentication.getName();
        List<PrescriptionDTO> response = prescriptionService.getPrescriptionsForPatient(patientEmail, 0, 1000).getContent();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/appointments/{appointmentId}/prescription")
    public ResponseEntity<PrescriptionDTO> getPatientPrescriptionByAppointmentId(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String patientEmail = authentication.getName();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NoSuchAppointmentException("No such appointment"));

        if (!appointment.getPatient().getUser().getEmail().equals(patientEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        PrescriptionDTO response = prescriptionService.getPrescriptionByAppointmentId(appointmentId);
        return ResponseEntity.ok(response);
    }
}
