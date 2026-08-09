package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private  final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody @Valid RegistrationDTO registration) {
        ResponseDTO resp = authService.registerUser(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody @Valid LoginRequestDTO login) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.login(login));

    }
    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO> forgotPassword(@RequestBody @Valid ForgotPasswordDTO fto) {
        ResponseDTO forg = authService.forgotPassword(fto);

        return ResponseEntity.ok(forg);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        ResponseDTO resp = authService.resetPassword(dto);
        return ResponseEntity.ok(resp);
    }


}
