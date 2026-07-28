package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.Exceptions.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import  com.hospital.hospital_management_system.service.CommonMethods.*;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminServiceImplementation implements AdminService {

       private final PatientRepo patientRepo;
       private final DoctorRepo doctorRepo;
       private final UserRepo userRepo;
       private final DepartmentRepo departmentRepo;
       private final AppointmentRepo appointmentRepo;
       private final ModelMapper mapper;
       private final CommonMethods commonMethods;

    @Override
    public Page<Patient> getAllPatients(int page, int size) {
        return patientRepo.findAll(
                PageRequest.of(page,size)
        );
    }

    private DoctorDTO convertToDoctorDTO(Doctor doctor) {
        DoctorDTO dto = mapper.map(doctor, DoctorDTO.class);

        // Map nested fields from User
        if (doctor.getUser() != null) {
            dto.setFirstName(doctor.getUser().getFirstName());
            dto.setLastName(doctor.getUser().getLastName());
            dto.setEmail(doctor.getUser().getEmail());
            dto.setPhoneNumber(doctor.getUser().getContactNumber());
            dto.setProfilePhoto(doctor.getUser().getProfilePhoto());
        }

        if (doctor.getDepartment() != null) {
            dto.setDepartment(doctor.getDepartment());
        }

        return dto;
    }

    @Override
    public Page<DoctorDTO> getAllDoctors(int page, int size) {
        Page<Doctor> doctors=doctorRepo.findAll(PageRequest.of(page,size));
        return  doctors.map(this::convertToDoctorDTO);

    }

    @Override
    public Page<ReqAppointmentDTO> getAllAppointments(int page, int size) {
       Page<Appointment> appointments=appointmentRepo.findAll(PageRequest.of(page, size));
       return appointments.map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<User> getAllUsers(int page, int size) {
       return userRepo.findAll(
               PageRequest.of(page,size)
       );
    }


    @Override
    @Transactional
    public ResponseDTO deleteDoctor(long doctorId) {
       Doctor doctor=doctorRepo.findById(doctorId).orElseThrow(()->new DoctorNotFoundException("No such doctor is found within the records"));

           doctorRepo.delete(doctor);
           return new ResponseDTO(Role.ADMIN,"Doctor is deleted successfully");

    }

    @Override
    @Transactional
    public ResponseDTO deleteUser(Long userId) {
        User user=userRepo.findById(userId).orElseThrow(()->new UserNotFoundException("NO such User is available within the records"));
        userRepo.delete(user);
        return new ResponseDTO(Role.ADMIN,"User deleted successfully");
    }

    @Override
    @Transactional
    public ResponseDTO deleteDepartment(Long departmentId) {

        Department department=departmentRepo.findById(departmentId).orElseThrow(()->new NoSuchDepartmentException("No such Department exists within our records"));

        for(Doctor doc:department.getDoctors()){
            doc.setDepartment(null);
        }

        departmentRepo.delete(department);

        return new ResponseDTO(Role.ADMIN,"Department is removed successfully");
    }

    @Override
    public DashBoardDTO getDashBoardDetails() {
        Long patientCount = patientRepo.count();
        Long doctorCount = doctorRepo.count();
        Long departmentCount = departmentRepo.count();
        Long userCount = userRepo.count();
        Long appointmentCount = appointmentRepo.count();

        //appointment dashboard
        Long pendingAppointment = appointmentRepo.countByStatus(AppointmentStatus.PENDING);
        Long confirmedAppointment = appointmentRepo.countByStatus(AppointmentStatus.CONFIRMED);
        Long completedAppointment = appointmentRepo.countByStatus(AppointmentStatus.COMPLETED);
        Long cancelledAppointment = appointmentRepo.countByStatus(AppointmentStatus.CANCELLED);

        return new DashBoardDTO(
                patientCount,
                doctorCount,
                departmentCount,
                userCount,
                appointmentCount,
                pendingAppointment,
                confirmedAppointment,
                completedAppointment,
                cancelledAppointment
        );
    }

    @Override
    public Patient getPatientById(Long patientId) {
        return patientRepo.findById(patientId).orElseThrow(()->new PatientNotFoundException("No Patient found"));
    }

    @Override
    public DoctorDTO getDoctorById(Long doctorId) {
        Doctor doctor= doctorRepo.findById(doctorId).orElseThrow(()->new NoSuchDoctorException("No doctor found"));
        return convertToDoctorDTO(doctor);
    }

    @Override
    public List<Department> getAllDepartments() {
        return  departmentRepo.findAll();
    }

    @Override
    public DepartmentDTO getDepartmentById(Long departmentId) {
        Department dep=departmentRepo.findById(departmentId).orElseThrow(()->new NoSuchDepartmentException("No department found"));
        DepartmentDTO dto= mapper.map(dep, DepartmentDTO.class);
        dto.setDepartmentId(dep.getDepartmentId());
        dto.setDoctorIds(
                dep.getDoctors().stream().map(Doctor::getDoctorId).toList()
        );
        return dto;
    }

    @Override
    @Transactional
    public ResponseDTO addDepartment(DepartmentDTO departmentDTO) {
        Department dep=new Department();
        dep.setDepartmentName(departmentDTO.getDepartmentName());
        dep.setDescription(departmentDTO.getDescription());
        departmentRepo.save(dep);

        List<Doctor> doctors=doctorRepo.findAllById(departmentDTO.getDoctorIds());

        for(Doctor doc:doctors){
           doc.setDepartment(dep);
        }
        doctorRepo.saveAll(doctors);

        return  new ResponseDTO(Role.ADMIN,"Successfully added department");
    }

    @Override
    @Transactional
    public ResponseDTO updateDepartment(Long departmentId, DepartmentUpdateDTO departmentUpdateDTO) {
        Department department=departmentRepo.findById(departmentId).orElseThrow(()->new NoSuchDepartmentException("No department found"));

        if(departmentUpdateDTO.getDepartmentName()!=null)
            department.setDepartmentName(departmentUpdateDTO.getDepartmentName());

        if(departmentUpdateDTO.getDescription()!=null){
            department.setDescription(departmentUpdateDTO.getDescription());
        }

        List<Long> addDocIds=departmentUpdateDTO.getAddDoctorIds();
        List<Long> deleteDocIds=departmentUpdateDTO.getRemoveDoctorIds();

        if (addDocIds!=null) {
            for(Long addDocs:addDocIds){
                Doctor doc=doctorRepo.findById(addDocs).
                        orElseThrow(()->new DoctorNotFoundException("No Doctor Found"));

                doc.setDepartment(department);

            }
        }

        if (deleteDocIds!=null) {
            for(Long delDocs:deleteDocIds){
                Doctor doc=doctorRepo.findById(delDocs).
                        orElseThrow(()->new DoctorNotFoundException("No Doctor Found"));

                doc.setDepartment(null);
            }
        }

        return new ResponseDTO(Role.ADMIN,"Department Updated Successfully");
    }


    @Override
    public User getUserById(Long userId) {
        return userRepo.findById(userId).orElseThrow(()->new UserNotFoundException("No User found"));
    }

    @Override
    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepo.findById(appointmentId).orElseThrow(()->new NoSuchAppointmentException("No Appointment Found"));
    }

    @Override
    @Transactional
    public ResponseDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment=appointmentRepo.findById(appointmentId).orElseThrow(()->new NoSuchAppointmentException("No Appointment found"));
        if(status!=null){
            appointment.setStatus(status);
        }
        return new ResponseDTO(Role.ADMIN,"Appointment Status is Updated Successfully");
    }

    @Override
    public Page<DoctorDTO> getDoctorsByDepartment(Long departmentId, int page, int size) {
        if(!departmentRepo.existsById(departmentId))
            throw new NoSuchDepartmentException("No department found");

        return doctorRepo.findByDepartment_DepartmentId(departmentId, PageRequest.of(page,size)).map(this::convertToDoctorDTO);

    }


    @Override
    public Page<DoctorDTO> searchDoctor(String keyword, int page, int size) {
         return doctorRepo.findByUser_FirstNameContainingIgnoreCase(keyword,PageRequest.of(page,size)).map(this::convertToDoctorDTO);
    }

    @Override
    public Page<Patient> searchPatient(String keyword, int page, int size) {
        return patientRepo.findByUser_FirstNameContainingIgnoreCase(keyword, PageRequest.of(page, size));
    }


    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByStatus(AppointmentStatus status, int page, int size) {
        return appointmentRepo.findByStatus(status,PageRequest.of(page,size)).map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByDoctor(Long doctorId, int page, int size) {
        return appointmentRepo.findByDoctor_doctorId(doctorId,PageRequest.of(page,size)).map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByPatient(Long patientId, int page, int size) {
        return appointmentRepo.findByPatient_patientId(patientId,PageRequest.of(page,size)).map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<User> searchUser(String keyword, int page, int size) {
        return userRepo.findByFirstName(keyword,PageRequest.of(page,size));
    }


}

