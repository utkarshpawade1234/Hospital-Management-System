package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateOrderResponseDTO {

    private Long paymentId;

    private String razorpayOrderId;

    private String receiptNumber;

    private BigDecimal amount;

    private String currency;

    private String razorpayKey;

    private String orderStatus;
}