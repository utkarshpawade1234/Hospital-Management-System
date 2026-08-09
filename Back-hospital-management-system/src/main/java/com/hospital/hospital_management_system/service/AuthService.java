package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;

public interface AuthService {

    ResponseDTO registerUser(RegistrationDTO dto);

    LoginResponseDTO login(LoginRequestDTO dto);

    ResponseDTO forgotPassword(ForgotPasswordDTO dto);

    ResponseDTO resetPassword(ResetPasswordDTO dto);
}
