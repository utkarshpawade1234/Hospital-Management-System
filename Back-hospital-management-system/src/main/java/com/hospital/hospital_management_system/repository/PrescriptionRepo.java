package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrescriptionRepo extends JpaRepository<Prescription, Long> {
    boolean existsByAppointmentAppointmentId(Long appointmentId);

    Page<Prescription> findByAppointmentDoctorUserEmail(String doctorEmail, Pageable pageable);

    @Query("SELECT p FROM Prescription p WHERE " +
            "LOWER(p.appointment.patient.user.firstName) LIKE LOWER(CONCAT('%', :patientName, '%')) OR " +
            "LOWER(p.appointment.patient.user.lastName) LIKE LOWER(CONCAT('%', :patientName, '%'))")
    Page<Prescription> searchByPatientName(@Param("patientName") String patientName, Pageable pageable);

    Page<Prescription> findByAppointmentPatientPatientId(Long patientId, Pageable pageable);

    Optional<Prescription> findByAppointmentAppointmentId(Long appointmentId);
}
