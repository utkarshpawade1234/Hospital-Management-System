package com.hospital.hospital_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRevenueDTO {

    private Long doctorId;

    private String doctorName;

    private BigDecimal doctorRevenue;
}
