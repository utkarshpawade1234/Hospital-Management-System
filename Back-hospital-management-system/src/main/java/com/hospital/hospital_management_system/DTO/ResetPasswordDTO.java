package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class ResetPasswordDTO {
    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @Size(min = 5, max = 20, message = "Password must be between 5 and 20 characters")
    private String newPassword;
}
