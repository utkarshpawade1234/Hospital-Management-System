package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin")
public class AdminController {


    private final AdminService adminService;

    @GetMapping("/patients")
    public ResponseEntity<Page<Patient>> getAllPatients(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllPatients(page, size));
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long patientId) {

        return ResponseEntity.ok(
                adminService.getPatientById(patientId)
        );
    }

    @GetMapping("/patients/search")
    public ResponseEntity<Page<Patient>> searchPatient(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.searchPatient(keyword, page, size)
        );

    }

    @GetMapping("/doctors")
    public ResponseEntity<Page<DoctorDTO>> getAllDoctors(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAllDoctors(page, size)
        );
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long doctorId) {

        return ResponseEntity.ok(
                adminService.getDoctorById(doctorId)
        );
    }

    @GetMapping("/doctors/search")
    public ResponseEntity<Page<DoctorDTO>> searchDoctor(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.searchDoctor(keyword, page, size)
        );
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                adminService.getAllDepartments()
        );
    }

    @GetMapping("/departments/{departmentId}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable Long departmentId) {

        return ResponseEntity.ok(
                adminService.getDepartmentById(departmentId)
        );
    }

    @PostMapping("/departments")
    public ResponseEntity<ResponseDTO> addDepartment(@RequestBody DepartmentDTO departmentDTO) {

        return ResponseEntity.ok(
                adminService.addDepartment(departmentDTO)
        );
    }

    @PutMapping("/departments/{departmentId}")
    public ResponseEntity<ResponseDTO> updateDepartment(@PathVariable Long departmentId, @RequestBody DepartmentUpdateDTO departmentUpdateDTO) {

        return ResponseEntity.ok(
                adminService.updateDepartment(
                        departmentId,
                        departmentUpdateDTO
                )
        );
    }


    @DeleteMapping("/departments/{departmentId}")
    public ResponseEntity<ResponseDTO> deleteDepartment(@PathVariable Long departmentId) {

        return ResponseEntity.ok(
                adminService.deleteDepartment(departmentId)
        );
    }


    @GetMapping("/departments/{departmentId}/doctors")
    public ResponseEntity<Page<DoctorDTO>> getDoctorsByDepartment(@PathVariable Long departmentId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getDoctorsByDepartment(
                        departmentId,
                        page,
                        size
                )
        );
    }


    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAllUsers(page, size)
        );
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {

        return ResponseEntity.ok(
                adminService.getUserById(userId)
        );
    }


    @GetMapping("/users/search")
    public ResponseEntity<Page<User>> searchUser(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.searchUser(
                        keyword,
                        page,
                        size
                )
        );
    }


    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ResponseDTO> deleteUser(@PathVariable Long userId) {

        return ResponseEntity.ok(
                adminService.deleteUser(userId)
        );
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<ResponseDTO> deleteDoctor(@PathVariable Long doctorId) {

        return ResponseEntity.ok(
                adminService.deleteDoctor(doctorId)
        );
    }

    @GetMapping("/appointments")
    public ResponseEntity<Page<AppointmentDTO>> getAllAppointments(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAllAppointments(page, size)
        );
    }


    @GetMapping("/appointments/{appointmentId}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long appointmentId) {

        return ResponseEntity.ok(
                adminService.getAppointmentById(appointmentId)
        );
    }

    @GetMapping("/appointments/status/{status}")
    public ResponseEntity<Page<AppointmentDTO>> getAppointmentsByStatus(@PathVariable AppointmentStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAppointmentsByStatus(
                        status,
                        page,
                        size
                )
        );
    }

    @GetMapping("/appointments/doctor/{doctorId}")
    public ResponseEntity<Page<AppointmentDTO>> getAppointmentsByDoctor(@PathVariable Long doctorId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAppointmentsByDoctor(
                        doctorId,
                        page,
                        size
                )
        );
    }

    @GetMapping("/appointments/patient/{patientId}")
    public ResponseEntity<Page<AppointmentDTO>> getAppointmentsByPatient(@PathVariable Long patientId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                adminService.getAppointmentsByPatient(
                        patientId,
                        page,
                        size
                )
        );
    }

    @PatchMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<ResponseDTO> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestParam AppointmentStatus status) {

        return ResponseEntity.ok(
                adminService.updateAppointmentStatus(
                        appointmentId,
                        status
                )
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashBoardDTO> getDashboardDetails() {

        return ResponseEntity.ok(
                adminService.getDashBoardDetails()
        );
    }
}
