package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.DoctorRepo;
import com.hospital.hospital_management_system.repository.PasswordResetRepo;
import com.hospital.hospital_management_system.repository.PatientRepo;
import com.hospital.hospital_management_system.repository.UserRepo;
import com.hospital.hospital_management_system.utils.JwtUtils;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PatientServiceImplement implements PatientService{


    private final UserRepo userrepo;

    private final PatientRepo patientrepo;
    private final EmailService emailService;
    private final ModelMapper mapper;
    private final DoctorRepo doctorrepo;
    private final PasswordResetRepo resetRepo;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    @Override
    public ResponseDTO registerUser(RegistrationDTO dto) {

        if((userrepo.findByEmail(dto.getEmail())).isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists");
        }
        User user = new User();
        user.setUser_role(Role.PATIENT);
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        user.setPassword(new BCryptPasswordEncoder().encode(dto.getPassword()));
        user.setContactNumber(dto.getPhoneNumber());
        user.setDob(dto.getDob());
        user.setAddress(dto.getAddress());
        user.setProfilePhoto(dto.getProfilephoto());


        User savedUser = userrepo.save(user);

        return new ResponseDTO(
                savedUser.getUser_role(),
                "User Created Successfully"
        );
    }

    @Override
    public LoginResponseDTO login(LoginDTO dto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(),dto.getPassword()));
        User u=userrepo.findByEmail(dto.getEmail()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));
        String token=jwtUtils.generateJwtToken(u.getEmail());

        return new LoginResponseDTO(token,u.getUser_role(),"Login Successfull");
    }


    @Override
    public ResponseDTO forgotPassword( ForgotPassDTO dto)  {

        User u = userrepo.findByEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "do you exist or not ?"));

        String token =
                UUID.randomUUID().toString();
        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setToken(token);

        resetToken.setExpiryTime(

                LocalDateTime.now()

                        .plusMinutes(15));

        resetToken.setUsed(false);

        resetToken.setUser(u);

        resetRepo.save(resetToken);

        String resetLink =
                "http://localhost:5173/reset-password?token=" + token;



        // Send Email
        try {
            emailService.sendPasswordResetEmail(dto.getEmail(), u.getFirstName() + " " + u.getLastName(), resetLink);
        } catch (Exception e) {
            System.err.println("Failed to send email via SMTP, continuing in local dev mode. Exception: " + e.getMessage());
        }

        return new ResponseDTO(
                u.getUser_role(),
                "Password Change Link generated successfully (Please check your terminal logs for the link if email delivery fails).");
    }

    @Override
    public ResponseDTO resetPassword(ResetPasswordDTO dto) {
        PasswordResetToken resetToken = resetRepo.findByToken(dto.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid password reset token"));

        if (resetToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has already been used");
        }

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(new BCryptPasswordEncoder().encode(dto.getNewPassword()));
        userrepo.save(user);

        resetToken.setUsed(true);
        resetRepo.save(resetToken);

        return new ResponseDTO(
                user.getUser_role(),
                "Password changed successfully"
        );
    }

    @Override
    public ResponseDTO registerPatientDetails(PatientDTO dto) {

        User u=userrepo.findByEmail(dto.getEmail()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));

        if (patientrepo.findByUser(u).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Patient details are already registered for this user");
        }
        Patient p = mapper.map(dto, Patient.class);

        p.setUser(u);

        patientrepo.save(p);


        return new ResponseDTO(
                u.getUser_role(),
                "Patient details added succesfully"
        );
    }

    @Override
    public ResponseDTO updatePatientDetails(UpdatePatientDTO dto) {

        User user = userrepo.findByEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Patient patient = patientrepo.findByUserEmail(dto.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient profile not found"));

        // User Table Updates
        if(dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());

        if(dto.getLastName() != null)
            user.setLastName(dto.getLastName());

        if(dto.getDob() != null)
            user.setDob(dto.getDob());

        if(dto.getAddress() != null)
            user.setAddress(dto.getAddress());

        if(dto.getPassword() != null)
            user.setPassword(dto.getPassword());

        if(dto.getProfilephoto() != null)
            user.setProfilePhoto(dto.getProfilephoto());

        if(dto.getPhoneNumber() != null)
            user.setContactNumber(dto.getPhoneNumber());


        // Patient Table Updates
        if(dto.getDescription() != null)
            patient.setDescription(dto.getDescription());

        if(dto.getBloodGroup() != null)
            patient.setBloodGroup(dto.getBloodGroup());

        if(dto.getEmergencyContactName() != null)
            patient.setEmergencyContactName(
                    dto.getEmergencyContactName());

        if(dto.getEmergencyContactNumber() != null)
            patient.setEmergencyContactNumber(
                    dto.getEmergencyContactNumber());

        if(dto.getEmergencyContactRelation() != null)
            patient.setEmergencyContactRelation(
                    dto.getEmergencyContactRelation());



        return new ResponseDTO(

                user.getUser_role(),
                "Profile Updated Successfully"
        );
    }

    @Override
    public PatientProfileDTO getMyProfile(String email) {

        User user = userrepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"));

        PatientProfileDTO dto = mapper.map(user, PatientProfileDTO.class);
        dto.setPhoneNumber(user.getContactNumber());

        java.util.Optional<Patient> patientOpt = patientrepo.findByUser(user);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            dto.setPatientId(patient.getPatientId());
            dto.setDescription(patient.getDescription());
            dto.setBloodGroup(patient.getBloodGroup());
            dto.setEmergencyContactName(patient.getEmergencyContactName());
            dto.setEmergencyContactNumber(patient.getEmergencyContactNumber());
            dto.setEmergencyContactRelation(patient.getEmergencyContactRelation());
        }

        return dto;
    }

    @Override
    public List<DoctorDTO> fetchDoctorDetailsByFirstAndLastName(String firstName, String lastName) {

        List<Doctor> doctors = doctorrepo.findByUserFirstNameStartingWithIgnoreCaseOrUserLastNameStartingWithIgnoreCase(firstName,lastName);

        if(doctors.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No doctors found");
        }


        return doctors.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<DoctorDTO> fetchDoctorDetailsBySpecialization(String specialization) {
        List<Doctor> doctors =
                doctorrepo
                        .findBySpecializationStartingWithIgnoreCase(
                                specialization);

        if(doctors.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No doctors found");
        }


        return doctors.stream().map(this::convertToDTO).toList();
    }

    @Override
    public ResponseDTO deletePatient(Long patientId) {

        Patient patient = patientrepo.findById(patientId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Patient not found"));

        Long userId = patient.getUser().getUser_id();

        patientrepo.delete(patient);

        userrepo.deleteById(userId);

        return new ResponseDTO(

                Role.PATIENT,
                "Patient Deleted Successfully"
        );
    }



    private DoctorDTO convertToDTO(Doctor doctor) {

        DoctorDTO dto = new DoctorDTO();

        dto.setDoctorId(doctor.getDoctorId());

        // User Table Fields
        dto.setFirstName(
                doctor.getUser().getFirstName());

        dto.setLastName(
                doctor.getUser().getLastName());

        dto.setEmail(
                doctor.getUser().getEmail());

        dto.setPhoneNumber(
                doctor.getUser().getContactNumber());

        dto.setProfilePhoto(
                doctor.getUser().getProfilePhoto());

        // Doctor Table Fields
        dto.setSpecialization(
                doctor.getSpecialization());

        dto.setQualification(
                doctor.getQualification());

        dto.setYearsOfExperience(
                doctor.getYearsOfExperience());

        dto.setConsultationFee(
                doctor.getConsultationFee());

        if (doctor.getDepartment() != null) {
            dto.setDepartment(doctor.getDepartment().toString());
        } else {
            dto.setDepartment("Not Assigned");
        }

        dto.setDescription(
                doctor.getDescription());

        dto.setRoomNumber(
                doctor.getRoomNumber());

        dto.setAvailabilityStatus(
                doctor.getAvailabilityStatus());

        return dto;
    }


}
