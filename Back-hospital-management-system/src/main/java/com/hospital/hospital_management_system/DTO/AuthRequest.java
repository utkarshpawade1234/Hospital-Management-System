package com.hospital.hospital_management_system.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthRequest {
    String username;
    String password;
}
