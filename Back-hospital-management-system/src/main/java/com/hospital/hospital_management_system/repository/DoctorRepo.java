package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor,Long> {
    List<Doctor> findBySpecializationStartingWithIgnoreCase(String specialization);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:firstName IS NULL OR :firstName = '' OR LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) OR LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
           "(:lastName IS NULL OR :lastName = '' OR LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')) OR LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :lastName, '%')))")
    List<Doctor> searchByName(@Param("firstName") String firstName, @Param("lastName") String lastName);

    List<Doctor> findByUserFirstNameStartingWithIgnoreCaseOrUserLastNameStartingWithIgnoreCase(String firstName, String lastName);

    Page<Doctor> findByDepartment_DepartmentId(Long departmentId, Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Doctor> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<Doctor> findByUser_FirstNameContainingIgnoreCase(String keyword, Pageable pageable);

    Optional<Doctor> findByUserEmail(String email);
}

