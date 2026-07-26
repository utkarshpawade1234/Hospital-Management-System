package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPassDTO {

    @NotBlank
    @Email
    private String email;
}
