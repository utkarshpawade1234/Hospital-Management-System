package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.DoctorDTO;
import com.hospital.hospital_management_system.DTO.ReqAppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.Exceptions.AppointmentNotFoundException;
import com.hospital.hospital_management_system.Exceptions.DoctorNotFoundException;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.AppointmentRepo;
import com.hospital.hospital_management_system.repository.DoctorRepo;
import com.hospital.hospital_management_system.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;

import com.hospital.hospital_management_system.repository.PaymentRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DoctorServiceImplementation implements DoctorService {

    private final DoctorRepo doctorRepo;

    private final AppointmentRepo appointmentRepo;

    private final PaymentRepository paymentRepository;

    private final ModelMapper mapper;

    private final CommonMethods commonMethods;

    private final UserRepo userRepo;

    private void setAppointmentPaymentStatus(Appointment appt) {
        Optional<Payment> successPayment = paymentRepository.findFirstByAppointmentAndPaymentStatusOrderByPaymentIdDesc(appt, PaymentStatus.SUCCESS);
        if (successPayment.isPresent()) {
            appt.setPaymentStatus(PaymentStatus.SUCCESS);
        } else {
            Optional<Payment> latestPayment = paymentRepository.findTopByAppointmentOrderByPaymentIdDesc(appt);
            appt.setPaymentStatus(latestPayment.map(Payment::getPaymentStatus).orElse(PaymentStatus.PENDING));
        }
    }

    @Override
    public DoctorDTO getMyProfile(String email) {

        Doctor doctor = doctorRepo.findByUserEmail(email)
                .orElseThrow(() -> new DoctorNotFoundException("No doctor Found"));

        DoctorDTO dto = mapper.map(doctor, DoctorDTO.class);

        User user = doctor.getUser();

        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getContactNumber());
        dto.setProfilePhoto(user.getProfilePhoto());

        return dto;
    }

    @Override
    public Page<ReqAppointmentDTO> getUpcomingAppointments(String email, int page, int size) {

        Page<Appointment> appts = appointmentRepo.findByDoctorUserEmail(email, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentId")));
        for (Appointment appt : appts.getContent()) {
            setAppointmentPaymentStatus(appt);
        }
        return appts.map(commonMethods::convertToAppointmentDTO);

    }

    @Override
    @Transactional
    public ResponseDTO changeStatus(String email, Doctor.AvailabilityStatus availabilityStatus) {
        Doctor doctor = doctorRepo.findByUserEmail(email)
                .orElseThrow(() -> new DoctorNotFoundException("No such doctor is found"));
        doctor.setAvailabilityStatus(availabilityStatus);
        return new ResponseDTO(Role.DOCTOR, "Status Updated");
    }

    @Override
    @Transactional
    public ResponseDTO updateMyProfile(String email, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepo.findByUserEmail(email)
                .orElseThrow(() -> new DoctorNotFoundException("No doctor Found"));

        if (doctorDTO.getAvailabilityStatus() != null)
            doctor.setAvailabilityStatus(doctorDTO.getAvailabilityStatus());

        if (doctorDTO.getDescription() != null)
            doctor.setDescription(doctorDTO.getDescription());

        if (doctorDTO.getFirstName() != null)
            doctor.getUser().setFirstName(doctorDTO.getFirstName());

        if (doctorDTO.getLastName() != null)
            doctor.getUser().setLastName(doctorDTO.getLastName());

        if (doctorDTO.getPhoneNumber() != null)
            doctor.getUser().setContactNumber(doctorDTO.getPhoneNumber());

        if (doctorDTO.getProfilePhoto() != null) {
            doctor.getUser().setProfilePhoto(doctorDTO.getProfilePhoto());
        }

        doctorRepo.save(doctor);

        return new ResponseDTO(Role.DOCTOR, "Successfully updated");

    }

    @Override
    public ReqAppointmentDTO getAppointmentById(String email, Long appointmentId) {
        Appointment appointment = appointmentRepo.findByDoctorUserEmailAndAppointmentId(email, appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment is found"));
        return commonMethods.convertToAppointmentDTO(appointment);

    }

    @Override
    @Transactional
    public ResponseDTO confirmAppointment(String email, Long appointmentId) {
        Appointment appointment = appointmentRepo.findByDoctorUserEmailAndAppointmentId(email, appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment Found"));

        appointment.setStatus(AppointmentStatus.CONFIRMED);

        return new ResponseDTO(Role.DOCTOR, "Appointment confirmed successfully");
    }

    @Override
    @Transactional
    public ResponseDTO completeAppointment(String email, Long appointmentId) {
        Appointment appointment = appointmentRepo.findByDoctorUserEmailAndAppointmentId(email, appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment is found"));
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return new ResponseDTO(Role.DOCTOR, "Successfully completed");
    }

    @Override
    @Transactional
    public ResponseDTO cancelAppointment(String email, Long appointmentId) {

        Appointment appointment = appointmentRepo.findByDoctorUserEmailAndAppointmentId(email, appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment found"));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return new ResponseDTO(Role.DOCTOR, "Successfully cancelled");
    }

}