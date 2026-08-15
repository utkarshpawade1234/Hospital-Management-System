package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Patient>> getAllPatients(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllPatients(page, size));
    }

    @GetMapping("/patients/{patientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long patientId) {
        return ResponseEntity.ok(adminService.getPatientById(patientId));
    }

    @GetMapping("/patients/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PatientDTO>> searchPatient(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.searchPatient(keyword, page, size));
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DoctorDTO>> getAllDoctors(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllDoctors(page, size));
    }

    @GetMapping("/doctors/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long doctorId) {
        return ResponseEntity.ok(adminService.getDoctorById(doctorId));
    }

    @GetMapping("/doctors/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DoctorDTO>> searchDoctor(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.searchDoctor(keyword, page, size));
    }

    @GetMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }

    @GetMapping("/departments/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable Long departmentId) {
        return ResponseEntity.ok(adminService.getDepartmentById(departmentId));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> addDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(adminService.addDepartment(departmentDTO));
    }

    @PutMapping("/departments/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateDepartment(@PathVariable Long departmentId, @Valid @RequestBody DepartmentUpdateDTO departmentUpdateDTO) {
        return ResponseEntity.ok(adminService.updateDepartment(departmentId, departmentUpdateDTO));
    }

    @DeleteMapping("/departments/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(adminService.deleteDepartment(departmentId));
    }

    @GetMapping("/departments/{departmentId}/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DoctorDTO>> getDoctorsByDepartment(@PathVariable Long departmentId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getDoctorsByDepartment(departmentId, page, size));
    }

    @DeleteMapping("/doctors/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(adminService.deleteDoctor(doctorId));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReqAppointmentDTO>> getAllAppointments(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllAppointments(page, size));
    }

    @GetMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(adminService.getAppointmentById(appointmentId));
    }

    @DeleteMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(adminService.deleteAppointment(appointmentId));
    }

    @GetMapping("/appointments/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReqAppointmentDTO>> getAppointmentsByStatus(@PathVariable AppointmentStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAppointmentsByStatus(status, page, size));
    }

    @GetMapping("/appointments/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReqAppointmentDTO>> getAppointmentsByDoctor(@PathVariable Long doctorId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAppointmentsByDoctor(doctorId, page, size));
    }

    @GetMapping("/appointments/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReqAppointmentDTO>> getAppointmentsByPatient(@PathVariable Long patientId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAppointmentsByPatient(patientId, page, size));
    }

    @PatchMapping("/appointments/{appointmentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(adminService.updateAppointmentStatus(appointmentId, status));
    }

    @DeleteMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deletePatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(adminService.deletePatient(patientId));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashBoardDTO> getDashboardDetails() {
        return ResponseEntity.ok(adminService.getDashBoardDetails());
    }

    @PutMapping("/patient")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updatePatient(@Valid @RequestBody UpdatePatientDTO patientDetails) {
        return ResponseEntity.ok(adminService.updatePatientDetails(patientDetails));
    }

    @PutMapping("/doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> updateDoctor(@Valid @RequestBody DoctorDTO doctorDTO) {
        return ResponseEntity.ok(adminService.updateDoctorDetails(doctorDTO));
    }

    @PostMapping("/doctor/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> createDoctor(@Valid @RequestBody DoctorCreateDTO doctorCreateDTO) {
        return ResponseEntity.ok(adminService.CreateDoctor(doctorCreateDTO));
    }

    @GetMapping("/departments/names")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getDepartmentNames() {
        return ResponseEntity.ok(adminService.getAllDepartmentNames());
    }
}
