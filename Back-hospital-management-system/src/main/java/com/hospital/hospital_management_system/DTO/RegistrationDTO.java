package com.hospital.hospital_management_system.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class RegistrationDTO {

        @NotBlank(message = "First Name should not be blank")
        @NotNull
        private String firstName;

        @NotBlank(message = "Last Name should  not be blank")
        @NotNull
        private String lastName;


        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 5, max = 20)
        @NotNull
        private String password;

        private String address;

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^[0-9]{10}$",
                message = "Phone number must be 10 digits"
        )
        private String phoneNumber;

        @NotNull(message = "Date of birth is required")
        @Past(message = "DOB must be in the past")
        private LocalDate dob;

        private String profilephoto;
}
