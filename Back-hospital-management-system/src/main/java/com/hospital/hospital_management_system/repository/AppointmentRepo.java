package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
        @Query("SELECT a from Appointment a where a.doctor.doctorId= :doctorId AND a.appointmentDate=:appointmentDate AND a.startTime<:startTime AND a.endTime>:endTime")
        Optional<Appointment> getSpecificDoctorAppointmentByParticularInterval(@Param("doctorId") Long doctorId,
                        @Param("appointmentDate") LocalDate appointmentDate, @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        List<Appointment> findByPatientPatientId(Long patientId);

        List<Appointment> findByDoctorDoctorId(Long doctorId);

        List<Appointment> findByPatientPatientIdOrderByAppointmentDateDescAppointmentIdDesc(Long patientId);

        List<Appointment> findByDoctorDoctorIdOrderByAppointmentDateDescAppointmentIdDesc(Long doctorId);

        List<Appointment> findAllByOrderByAppointmentDateDescAppointmentIdDesc();

        @Query("""
                            SELECT a
                            FROM Appointment a
                            WHERE LOWER(a.doctor.user.firstName) LIKE LOWER(CONCAT('%', :firstname, '%'))
                               OR LOWER(a.doctor.user.lastName) LIKE LOWER(CONCAT('%', :lastname, '%'))
                               OR LOWER(a.patient.user.firstName) LIKE LOWER(CONCAT('%', :firstname, '%'))
                               OR LOWER(a.patient.user.lastName) LIKE LOWER(CONCAT('%', :lastname, '%'))
                        """)
        List<Appointment> searchAppointmentsByDoctorOrPatientName(@Param("firstname") String firstname,
                        @Param("lastname") String lastname);

        void delete(@NonNull Appointment appointment);

        Long countByStatus(AppointmentStatus appointmentStatus);

        List<Appointment> findByStatus(AppointmentStatus appointmentStatus);

        Page<Appointment> findByStatus(AppointmentStatus appointmentStatus, Pageable pageable);

        Page<Appointment> findByDoctor_doctorId(Long doctorId, Pageable pageable);

        Page<Appointment> findByPatient_patientId(Long patientId, Pageable page);

        Page<Appointment> findByDoctorUserEmail(String email, Pageable pageable);

        Optional<Appointment> findByDoctorUserEmailAndAppointmentId(String email, Long appointmentId);

}
