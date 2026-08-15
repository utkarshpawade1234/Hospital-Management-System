package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.PasswordResetToken;
import com.hospital.hospital_management_system.model.Role;
import com.hospital.hospital_management_system.model.User;
import com.hospital.hospital_management_system.repository.PasswordResetRepo;
import com.hospital.hospital_management_system.repository.UserRepo;
import com.hospital.hospital_management_system.Exceptions.UserNotFoundException;
import com.hospital.hospital_management_system.utils.JwtUtils;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImplementation implements AuthService {

    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordResetRepo passwordResetRepo;
    private final EmailService emailService;


    @PostConstruct
    public void generateRandomPassword(){
        System.out.println("Patient-"+passwordEncoder.encode("patient123"));
        System.out.println("Doctor:-"+passwordEncoder.encode("doctor123"));
        System.out.println("Admin:-"+passwordEncoder.encode("admin123"));
    }

    @Override
    public ResponseDTO registerUser(RegistrationDTO dto) {

        if ((userRepo.findByEmail(dto.getEmail())).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = new User();
        user.setUser_role(Role.PATIENT);
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setContactNumber(dto.getPhoneNumber());
        user.setDob(dto.getDob());
        user.setAddress(dto.getAddress());
        user.setProfilePhoto(dto.getProfilephoto());


        User savedUser = userRepo.save(user);

        return new ResponseDTO(savedUser.getUser_role(), "User Created Successfully");
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        User u = userRepo.findByEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));
        String token = jwtUtils.generateJwtToken(u.getEmail());

        return new LoginResponseDTO(token, u.getUser_role(), "Login Successfully");
    }

    @Override
    public ResponseDTO forgotPassword(ForgotPasswordDTO dto) {
        User u = userRepo.findByEmail(dto.getEmail()).orElseThrow(() -> new UserNotFoundException("Email not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(token);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        resetToken.setUser(u);

        passwordResetRepo.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.sendPasswordResetEmail(dto.getEmail(), u.getFirstName() + " " + u.getLastName(), resetLink);

        return new ResponseDTO(u.getUser_role(), "Password Change Link generated successfully");
    }

    @Override
    public ResponseDTO resetPassword(ResetPasswordDTO dto) {
        PasswordResetToken resetToken = passwordResetRepo.findByToken(dto.getToken()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid password reset token"));

        if (resetToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has already been used");
        }

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(new BCryptPasswordEncoder().encode(dto.getNewPassword()));
        userRepo.save(user);

        resetToken.setUsed(true);
        passwordResetRepo.save(resetToken);

        return new ResponseDTO(user.getUser_role(), "Password changed successfully");
    }

}
