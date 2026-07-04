package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment,Long> {
    @Query("SELECT a from Appointment a where a.doctor.doctorId= :doctorId AND a.appointmentDate=:appointmentDate AND a.startTime<:startTime AND a.endTime>:endTime")
    Optional<Appointment>  getSpeciifcDoctorAppointmentByParticularInterval(@Param("doctorId") Long doctorId, @Param("appointmentDate") LocalDate appointmentDate, @Param("startTime")LocalTime startTime, @Param("endTime") LocalTime endTime);


    List<Appointment> findByPatientPatientId(Long patientId);
    List<Appointment> findByDoctorDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
    @Query("""
    SELECT a
    FROM Appointment a
    WHERE LOWER(a.doctor.user.firstName) LIKE LOWER(CONCAT('%', :firstname, '%'))
       OR LOWER(a.doctor.user.lastName) LIKE LOWER(CONCAT('%', :lastname, '%'))
       OR LOWER(a.patient.user.firstName) LIKE LOWER(CONCAT('%', :firstname, '%'))
       OR LOWER(a.patient.user.lastName) LIKE LOWER(CONCAT('%', :lastname, '%'))
""")
    List<Appointment> searchAppointmentsByDoctorOrPatientName(@Param("firstname") String firstname,@Param("lastname") String lastname);
}
