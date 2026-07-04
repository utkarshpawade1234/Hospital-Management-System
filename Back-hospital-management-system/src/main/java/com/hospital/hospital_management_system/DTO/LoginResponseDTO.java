package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.Role;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@RequiredArgsConstructor
public class LoginResponseDTO {


    private final String jwtToken;
    private final Role role;
    private final String message;


}
