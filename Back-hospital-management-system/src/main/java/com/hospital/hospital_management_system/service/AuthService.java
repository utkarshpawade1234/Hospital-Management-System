package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;

public interface AuthService {

     ResponseDTO registerUser(RegistrationDTO dto);
    LoginResponseDTO login(LoginDTO dto);

    ResponseDTO forgotPassword(ForgotPassDTO dto);

    ResponseDTO resetPassword(ResetPasswordDTO dto);
}
