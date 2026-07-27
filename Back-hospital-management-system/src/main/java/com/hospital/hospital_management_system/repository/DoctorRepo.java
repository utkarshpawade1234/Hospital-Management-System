package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends  JpaRepository<Doctor,Long> {
    List<Doctor> findBySpecializationStartingWithIgnoreCase(String specialization);


    List<Doctor> findByUserFirstNameStartingWithIgnoreCaseOrUserLastNameStartingWithIgnoreCase(String firstName, String lastName);

    Page<Doctor> findByDepartment_DepartmentId(Long departmentId, Pageable pageable);

    Page<Doctor> findByUser_FirstNameContainingIgnoreCase(String keyword, Pageable pageable);


    Optional<Doctor> findByUserEmail(String email);


}
