package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends  JpaRepository<Doctor,Long> {
    List<Doctor> findBySpecializationStartingWithIgnoreCase(String specialization);


    List<Doctor> findByUserFirstNameStartingWithIgnoreCaseOrUserLastNameStartingWithIgnoreCase(String firstName, String lastName);


}
