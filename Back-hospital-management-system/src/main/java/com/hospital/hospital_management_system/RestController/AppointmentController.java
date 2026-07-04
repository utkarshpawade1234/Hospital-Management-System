package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.AppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import com.hospital.hospital_management_system.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;


    @PostMapping("/booking")
    public ResponseEntity<ResponseDTO> appointmentBooking(@RequestBody AppointmentDTO appointmentdto){
        return ResponseEntity.ok(appointmentService.bookAppointment(appointmentdto));

    }
    @GetMapping("admin/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments(){
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAllAppointmentByPatientId(@PathVariable Long patientId){
        return ResponseEntity.ok(appointmentService.getAllAppointmentsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAllAppointmentByDoctorId(@PathVariable Long doctorId){
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
    }

    @PostMapping("/byName")
    public ResponseEntity<List<Appointment>> getAllAppointmentByName(@RequestBody String name){
        String[] args=name.split(" ");
        return  ResponseEntity.ok(appointmentService.getAllAppointmentByPatientAndDoctorName(args[0],args[1]));
    }

    @PostMapping("/bystatus")
    public ResponseEntity<List<Appointment>>  getAllAppointmentByStatus(@RequestParam AppointmentStatus status){
        return ResponseEntity.ok(appointmentService.getAllAppointmentByStatus(status));
    }
}
