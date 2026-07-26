package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.AppointmentDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.Exceptions.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.AppointmentRepo;
import com.hospital.hospital_management_system.repository.DoctorRepo;
import com.hospital.hospital_management_system.repository.PatientRepo;
import com.hospital.hospital_management_system.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentServiceImplement implements AppointmentService {

    private final UserRepo userRepo;

    private final PatientRepo patientrepo;

    private final DoctorRepo doctorrepo;

    private final AppointmentRepo appointmentRepo;

    @Override
    public ResponseDTO bookAppointment(AppointmentDTO appointmentdto, String email) {
        Patient patient = patientrepo.findByUserEmail(email)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found"));

        Doctor doctor = doctorrepo.findById(appointmentdto.getDoctorId())
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found"));

        if (doctor.getAvailabilityStatus() == Doctor.AvailabilityStatus.NOT_AVAILABLE
                || doctor.getAvailabilityStatus() == Doctor.AvailabilityStatus.ON_LEAVE) {
            throw new DoctorUnavailableException("Doctor is on leave");
        }
        Optional<Appointment> appointment = appointmentRepo.getSpeciifcDoctorAppointmentByParticularInterval(
                appointmentdto.getDoctorId(), appointmentdto.getAppointmentDate(), appointmentdto.getAppointmentTime(),
                appointmentdto.getAppointmentTime().plusMinutes(30));
        if (appointment.isPresent())
            throw new AppointmentAlreadyExistsException("Appointment slot already booked");

        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(patient);
        newAppointment.setDoctor(doctor);
        newAppointment.setAppointmentDate(appointmentdto.getAppointmentDate());
        newAppointment.setStartTime(appointmentdto.getAppointmentTime());
        newAppointment.setEndTime(appointmentdto.getAppointmentTime().plusMinutes(30));
        newAppointment.setDepartment(doctor.getDepartment());
        newAppointment.setAppointmentType(AppointmentType.CONSULTATION);
        newAppointment.setStatus(AppointmentStatus.PENDING);
        newAppointment.setRemarks(appointmentdto.getRemarks());

        appointmentRepo.save(newAppointment);

        return new ResponseDTO(Role.PATIENT, "Appointment Succesfully done");

    }

    @Override
    public List<Appointment> getAllAppointmentsByPatientId(Long patientId) {
        return appointmentRepo.findByPatientPatientId(patientId);

    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepo.findByDoctorDoctorId(doctorId);

    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }

    @Override
    public List<Appointment> getAllAppointmentByPatientAndDoctorName(String firstName, String lastName) {
        return appointmentRepo.searchAppointmentsByDoctorOrPatientName(firstName, lastName);
    }

    public List<Appointment> getAllAppointmentByStatus(AppointmentStatus status) {
        return appointmentRepo.findByStatus(status);
    }

    @Override
    public ResponseDTO CancelAppointment(Long AppointmentId, String email) {
        appointmentRepo.delete(appointmentRepo.findById(AppointmentId).orElseThrow(()->new NoSuchAppointmentException("No such Appointment exist within our records")));
        return new ResponseDTO(null,"Appointment is succesfully ca+ncelled");
    }

}
