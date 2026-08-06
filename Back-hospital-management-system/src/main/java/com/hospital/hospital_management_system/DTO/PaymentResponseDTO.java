package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.OrderStatus;
import com.hospital.hospital_management_system.model.PaymentMethod;
import com.hospital.hospital_management_system.model.PaymentStatus;
import com.hospital.hospital_management_system.model.RefundStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResponseDTO {

    private Long paymentId;

    private Long appointmentId;

    private com.hospital.hospital_management_system.model.AppointmentStatus appointmentStatus;

    private Long patientId;

    private Long doctorId;

    private Long userId;

    private String patientName;

    private String doctorName;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String receiptNumber;

    private BigDecimal amount;

    private String currency;

    private PaymentMethod paymentMethod;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private BigDecimal razorpayFee;

    private BigDecimal taxAmount;

    private String refundId;

    private BigDecimal refundAmount;

    private RefundStatus refundStatus;

    private String refundReason;

    private String failureReason;

    private String notes;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;
}