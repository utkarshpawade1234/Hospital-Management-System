package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPaymentDTO {

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

}