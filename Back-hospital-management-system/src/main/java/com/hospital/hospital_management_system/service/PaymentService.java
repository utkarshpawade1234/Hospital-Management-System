package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import org.springframework.data.domain.Page;

public interface PaymentService {

    CreateOrderResponseDTO createOrder(CreateOrderRequestDTO dto, String email);

    ResponseDTO verifyPayment(VerifyPaymentDTO dto);

    PaymentResponseDTO getPaymentById(Long paymentId, String email);

    Page<PaymentResponseDTO> getMyPaymentHistory(String email, int page, int size);

    Page<PaymentResponseDTO> getPaymentsByAppointment(Long appointmentId, int page, int size);

    Page<PaymentResponseDTO> getAllPayments(int page, int size);

    ResponseDTO refundPayment(Long paymentId);

//    Page<PaymentResponseDTO> getPaymentsByStatus(
//            PaymentStatus paymentStatus,
//            int page,
//            int size);
//
//    Page<PaymentResponseDTO> getPaymentsByMethod(
//            PaymentMethod paymentMethod,
//            int page,
//            int size);
//
//    Page<PaymentResponseDTO> getPaymentsByDoctor(
//            Long doctorId,
//            int page,
//            int size);
//
//    Page<PaymentResponseDTO> getPaymentsByPatient(
//            Long patientId,
//            int page,
//            int size);
//
//    Page<PaymentResponseDTO> getTodaysPayments(
//            int page,
//            int size);
//
//
//    PaymentAnalyticsDTO getPaymentAnalytics();
//
//    RevenueDTO getRevenueBetweenDates(
//            LocalDate startDate,
//            LocalDate endDate);
//
//    List<MonthlyRevenueDTO> getMonthlyRevenue(Integer year);
//
//    DoctorEarningDTO getDoctorEarnings(Long doctorId);
//
//    HospitalRevenueDTO getHospitalRevenue();
//
//    List<DepartmentRevenueDTO> getDepartmentRevenue();
//
//    List<TopDoctorDTO> getTopDoctors();
//
//    PaymentStatisticsDTO getPaymentStatistics();
//
//    DashboardDTO getDashboard();
//
//
//
//    void autoRefundPendingAppointments();

}