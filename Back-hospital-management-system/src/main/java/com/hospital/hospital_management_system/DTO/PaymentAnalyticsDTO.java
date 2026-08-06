package com.hospital.hospital_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentAnalyticsDTO {


    private BigDecimal totalRevenue;

    private BigDecimal todayRevenue;

    private Long successfulPayments;

    private Long failedPayments;

    private Long pendingPayments;

    private Long refundedPayments;

    private Long totalTransactions;
}
