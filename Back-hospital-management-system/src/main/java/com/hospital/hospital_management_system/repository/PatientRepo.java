package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Patient;
import com.hospital.hospital_management_system.model.User;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient,Long> {

    Optional<Patient> findByUserEmail(String email);

    Optional<Patient> findByUser(User user);

    void deleteById(@NonNull Long patientId);

    @Query("Select u.user.user_id from Patient u where u.patientId= :patientId")
    Long findUserId(@Param("patientId") Long patientId);


}
