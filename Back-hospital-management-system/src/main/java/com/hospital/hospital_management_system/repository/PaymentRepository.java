package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {


    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Page<Payment> findByPatient(Patient patient, Pageable pageable);

    Page<Payment> findByPatientAndPaymentStatus(Patient patient, PaymentStatus paymentStatus, Pageable pageable);

    Page<Payment> findByAppointment(Appointment appointment, Pageable pageable);

    Page<Payment> findByAppointmentOrderByPaymentIdDesc(Appointment appointment, Pageable pageable);

    Page<Payment> findByDoctorDoctorId(Long doctorId, Pageable pageable);

    Page<Payment> findByPatientPatientId(Long patientId, Pageable pageable);

    Page<Payment> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    Page<Payment> findByPaymentMethod(PaymentMethod paymentMethod, Pageable pageable);


    @Query("""
            SELECT COALESCE(SUM(p.amount),0)
            FROM Payment p
            WHERE p.paymentStatus='SUCCESS'
            """)
    BigDecimal getTotalRevenue();

    @Query("""
            SELECT COALESCE(SUM(p.amount),0)
            FROM Payment p
            WHERE p.paymentStatus='SUCCESS'
            AND DATE(p.paidAt)=CURRENT_DATE
            """)
    BigDecimal getTodayRevenue();

    Long countByPaymentStatus(PaymentStatus paymentStatus);

    Long countByPaymentMethod(PaymentMethod paymentMethod);


    @Query("""
            SELECT COALESCE(SUM(p.amount),0)
            FROM Payment p
            WHERE p.paymentStatus='SUCCESS'
            AND p.paidAt BETWEEN :startDate AND :endDate
            """)
    BigDecimal getRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("""
            SELECT MONTH(p.paidAt),
                   SUM(p.amount)
            FROM Payment p
            WHERE YEAR(p.paidAt)=:year
            AND p.paymentStatus='SUCCESS'
            GROUP BY MONTH(p.paidAt)
            ORDER BY MONTH(p.paidAt)
            """)
    List<Object[]> getMonthlyRevenue(Integer year);


    Optional<Payment> findFirstByAppointmentAndPaymentStatusOrderByPaymentIdDesc(Appointment appointment, PaymentStatus paymentStatus);

    Optional<Payment> findTopByAppointmentOrderByPaymentIdDesc(Appointment appointment);

    @Query("""
            SELECT COALESCE(SUM(p.amount),0)
            FROM Payment p
            WHERE p.doctor.doctorId=:doctorId
            AND p.paymentStatus='SUCCESS'
            """)
    BigDecimal getDoctorRevenue(Long doctorId);

    @Query("""
            SELECT COALESCE(SUM(p.amount)-COUNT(p)*500,0)
            FROM Payment p
            WHERE p.doctor.doctorId=:doctorId
            AND p.paymentStatus='SUCCESS'
            """)
    BigDecimal getDoctorEarnings(Long doctorId);


    @Query("""
            SELECT COUNT(p)*500
            FROM Payment p
            WHERE p.paymentStatus='SUCCESS'
            """)
    BigDecimal getHospitalRevenue();



    @Query("""
            SELECT p.doctor.department.departmentName,
                   SUM(p.amount)
            FROM Payment p
            WHERE p.paymentStatus='SUCCESS'
            GROUP BY p.doctor.department.departmentName
            """)
    List<Appointment> getDepartmentRevenue();


}
