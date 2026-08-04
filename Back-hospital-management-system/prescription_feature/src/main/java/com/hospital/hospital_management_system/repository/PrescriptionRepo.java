package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepo extends JpaRepository<Prescription,Long> {



    @Query("""
        SELECT p
        FROM Prescription p
        WHERE LOWER(CONCAT(
            p.appointment.patient.user.firstName,
            ' ',
            p.appointment.patient.user.lastName
        ))
        LIKE LOWER(CONCAT('%', :patientName, '%'))
    """)
    Page<Prescription> searchByPatientName(
            @Param("patientName") String patientName,
            Pageable pageable);



    boolean existsByAppointmentAppointmentId(Long appointmentId);
    Optional<Prescription> findByAppointmentAppointmentId(Long appointmentId);
    Page<Prescription> findByAppointmentPatientPatientId(Long patientId,Pageable pageable);
    Page<Prescription> findByAppointmentDoctorDoctorId(Long doctorId,Pageable pageable);
    Page<Prescription> findByAppointmentDoctorUserEmail(String email, Pageable pageable);
}

