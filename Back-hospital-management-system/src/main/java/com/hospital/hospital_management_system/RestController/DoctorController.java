package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.DoctorDTO;
import com.hospital.hospital_management_system.DTO.ReqAppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/profile")
    public ResponseEntity<DoctorDTO> getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(doctorService.getMyProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<ResponseDTO> updateMyProfile(
            Authentication authentication,
            @RequestBody DoctorDTO doctorDTO) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.updateMyProfile(email, doctorDTO));
    }



    @PutMapping("/status")
    public ResponseEntity<ResponseDTO> changeStatus(
            Authentication authentication,
            @RequestParam Doctor.AvailabilityStatus availabilityStatus) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.changeStatus(email, availabilityStatus));
    }



    @GetMapping("/appointments")
    public ResponseEntity<Page<ReqAppointmentDTO>> getUpcomingAppointments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.getUpcomingAppointments(email, page, size));
    }

    @GetMapping("/appointments/{appointmentId}")
    public ResponseEntity<ReqAppointmentDTO> getAppointmentById(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.getAppointmentById(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/confirm")
    public ResponseEntity<ResponseDTO> confirmAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.confirmAppointment(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/complete")
    public ResponseEntity<ResponseDTO> completeAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.completeAppointment(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<ResponseDTO> cancelAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                doctorService.cancelAppointment(email, appointmentId));
    }

}

