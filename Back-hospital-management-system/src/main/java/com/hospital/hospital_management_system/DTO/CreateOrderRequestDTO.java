package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequestDTO {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

}