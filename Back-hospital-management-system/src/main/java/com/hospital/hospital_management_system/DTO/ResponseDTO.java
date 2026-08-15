package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.Role;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
public class ResponseDTO {
    private Role role;
    private String message;
    
    private Long appointmentId;

    
    public ResponseDTO(Role role, String message) {
        this.role = role;
        this.message = message;
        this.appointmentId = null;
    }

    public ResponseDTO(String message) {
        this.role = null;
        this.message = message;
        this.appointmentId = null;
    }
}

