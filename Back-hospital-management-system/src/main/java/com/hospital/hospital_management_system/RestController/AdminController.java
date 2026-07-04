package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.model.Patient;
import com.hospital.hospital_management_system.model.Role;
import com.hospital.hospital_management_system.repository.DoctorRepo;
import com.hospital.hospital_management_system.repository.PatientRepo;
import com.hospital.hospital_management_system.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin")
public class AdminController {


    @GetMapping("/users")
    public List<Patient> getAllPatient(){
      return null;
    }


}
