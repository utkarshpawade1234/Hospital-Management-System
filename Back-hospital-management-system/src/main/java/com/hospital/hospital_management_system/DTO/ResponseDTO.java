package com.hospital.hospital_management_system.DTO;

import com.hospital.hospital_management_system.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Setter
@Getter
@RequiredArgsConstructor
public class ResponseDTO {
    private final Role role;
    private final String message;
}
