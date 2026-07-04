package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.Exceptions.AppointmentNotFoundException;
import com.hospital.hospital_management_system.Exceptions.DoctorNotFoundException;
import com.hospital.hospital_management_system.Exceptions.DoctorUnavailableException;
import com.hospital.hospital_management_system.model.Appointment;
import com.hospital.hospital_management_system.model.AppointmentStatus;
import com.hospital.hospital_management_system.model.Doctor;
import com.hospital.hospital_management_system.model.Role;
import com.hospital.hospital_management_system.repository.AppointmentRepo;
import com.hospital.hospital_management_system.repository.DoctorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImplementation implements  DoctorService{
    private final DoctorRepo doctorRepo;
    private final AppointmentRepo appointmentRepo;

    @Override
    public Doctor getMyProfile(Long doctorId) {
        return doctorRepo.findById(doctorId).orElseThrow(()->new DoctorNotFoundException("No such doctor present within the record"));

    }

    @Override
    public List<Appointment> getUpcomingAppointments(Long doctorId) {
        List<Appointment> appointment=appointmentRepo.findByDoctorDoctorId(doctorId);
        return appointment;
    }

    @Override
    public ResponseDTO pendingAppointmentApproval(Long AppointmentId, AppointmentStatus appointment) {
        Appointment appointment1=appointmentRepo.findById(AppointmentId).orElseThrow(()->new AppointmentNotFoundException("There is no such Appointment Present with the record"));
        appointment1.setStatus(appointment);
        return new ResponseDTO( Role.DOCTOR, "Update status of Appointment");

    }

    @Override
    public ResponseDTO changeStatus(Long doctorId,Doctor.AvailabilityStatus availabilityStatus){
        Doctor doctor=doctorRepo.findById(doctorId).orElseThrow(()->new DoctorUnavailableException("No such doctor persent within the records"));
        doctor.setAvailabilityStatus(availabilityStatus);

        return new ResponseDTO(Role.DOCTOR,"availibility succesfully updated");
    }




}
