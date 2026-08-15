package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.DoctorDTO;
import com.hospital.hospital_management_system.DTO.MedicineMasterDTO;
import com.hospital.hospital_management_system.DTO.ReqAppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.service.DoctorService;
import com.hospital.hospital_management_system.service.MedicineMasterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final DoctorService doctorService;
    private final MedicineMasterService medicineMasterService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorDTO> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.getMyProfile(email));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ResponseDTO> updateMyProfile(Authentication authentication, @Valid @RequestBody DoctorDTO doctorDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.updateMyProfile(email, doctorDTO));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ResponseDTO> changeStatus(Authentication authentication, @RequestParam Doctor.AvailabilityStatus availabilityStatus) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.changeStatus(email, availabilityStatus));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Page<ReqAppointmentDTO>> getUpcomingAppointments(Authentication authentication, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.getUpcomingAppointments(email, page, size));
    }

    @GetMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ReqAppointmentDTO> getAppointmentById(Authentication authentication, @PathVariable Long appointmentId) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.getAppointmentById(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ResponseDTO> confirmAppointment(Authentication authentication, @PathVariable Long appointmentId) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.confirmAppointment(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ResponseDTO> completeAppointment(Authentication authentication, @PathVariable Long appointmentId) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.completeAppointment(email, appointmentId));
    }

    @PutMapping("/appointments/{appointmentId}/cancel")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ResponseDTO> cancelAppointment(Authentication authentication, @PathVariable Long appointmentId) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.cancelAppointment(email, appointmentId));
    }

    @GetMapping("/medicines")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<Page<MedicineMasterDTO>> getAllMedicines(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(medicineMasterService.getAllActiveMedicines(pageable));
    }

    @GetMapping("/medicines/search")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<Page<MedicineMasterDTO>> searchMedicine(@RequestParam String keyword, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(medicineMasterService.searchActiveMedicine(keyword, pageable));
    }

    @GetMapping("/medicines/{medicineId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<MedicineMasterDTO> getMedicineById(@PathVariable Long medicineId) {
        return ResponseEntity.ok(medicineMasterService.getMedicineById(medicineId));
    }
}
