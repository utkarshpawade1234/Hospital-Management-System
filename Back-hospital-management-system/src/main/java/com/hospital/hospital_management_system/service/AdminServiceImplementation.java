package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.Exceptions.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final PrescriptionRepo prescriptionRepo;
    private final ModelMapper mapper;
    private final CommonMethods commonMethods;
    private final PasswordEncoder passwordEncoder;
    private final PatientService patientService;

    @Override
    public Page<Patient> getAllPatients(int page, int size) {
        return patientRepo.findAll(PageRequest.of(page, size));
    }

    @Override
    public Page<DoctorDTO> getAllDoctors(int page, int size) {
        Page<Doctor> doctors = doctorRepo.findAll(PageRequest.of(page, size));
        return doctors.map(commonMethods::convertToDTO);

    }

    @Override
    public Page<ReqAppointmentDTO> getAllAppointments(int page, int size) {
        Page<Appointment> appointments = appointmentRepo.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDate", "appointmentId")));
        return appointments.map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    @Transactional
    public ResponseDTO deleteDoctor(long doctorId) {
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("No such doctor is found within the records"));

        User user = doctor.getUser();
        doctorRepo.delete(doctor);
        if (user != null) {
            userRepo.delete(user);
        }
        return new ResponseDTO(Role.ADMIN, "Doctor is deleted successfully");
    }

    @Override
    @Transactional
    public ResponseDTO deleteDepartment(Long departmentId) {

        Department department = departmentRepo.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("No such Department exists within our records"));

        for (Doctor doc : department.getDoctors()) {
            doc.setDepartment(null);
        }

        departmentRepo.delete(department);

        return new ResponseDTO(Role.ADMIN, "Department is removed successfully");
    }

    @Override
    public DashBoardDTO getDashBoardDetails() {
        Long patientCount = patientRepo.count();
        Long doctorCount = doctorRepo.count();
        Long departmentCount = departmentRepo.count();
        Long userCount = userRepo.count();
        Long appointmentCount = appointmentRepo.count();

        Long pendingAppointment = appointmentRepo.countByStatus(AppointmentStatus.PENDING);
        Long confirmedAppointment = appointmentRepo.countByStatus(AppointmentStatus.CONFIRMED);
        Long completedAppointment = appointmentRepo.countByStatus(AppointmentStatus.COMPLETED);
        Long cancelledAppointment = appointmentRepo.countByStatus(AppointmentStatus.CANCELLED);

        return new DashBoardDTO(patientCount, doctorCount, departmentCount, userCount, appointmentCount,
                pendingAppointment, confirmedAppointment, completedAppointment, cancelledAppointment);
    }

    @Override
    public Patient getPatientById(Long patientId) {
        return patientRepo.findById(patientId).orElseThrow(() -> new PatientNotFoundException("No Patient found"));
    }

    @Override
    public DoctorDTO getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepo.findById(doctorId).orElseThrow(() -> new DoctorNotFoundException("No doctor found"));
        return commonMethods.convertToDTO(doctor);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepo.findAll();
    }

    @Override
    public DepartmentDTO getDepartmentById(Long departmentId) {
        Department dep = departmentRepo.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("No department found"));
        DepartmentDTO dto = mapper.map(dep, DepartmentDTO.class);
        dto.setDepartmentId(dep.getDepartmentId());
        dto.setDoctorIds(dep.getDoctors().stream().map(Doctor::getDoctorId).toList());
        return dto;
    }

    @Override
    @Transactional
    public ResponseDTO addDepartment(DepartmentDTO departmentDTO) {
        Department dep = new Department();
        dep.setDepartmentName(departmentDTO.getDepartmentName());
        dep.setDescription(departmentDTO.getDescription());
        departmentRepo.save(dep);

        List<Doctor> doctors = doctorRepo.findAllById(departmentDTO.getDoctorIds());

        for (Doctor doc : doctors) {
            doc.setDepartment(dep);
            doctorRepo.save(doc);
        }

        return new ResponseDTO(Role.ADMIN, "Successfully added department");
    }

    @Override
    @Transactional
    public ResponseDTO updateDepartment(Long departmentId, DepartmentUpdateDTO departmentUpdateDTO) {
        Department department = departmentRepo.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("No department found"));

        if (departmentUpdateDTO.getDepartmentName() != null)
            department.setDepartmentName(departmentUpdateDTO.getDepartmentName());

        if (departmentUpdateDTO.getDescription() != null) {
            department.setDescription(departmentUpdateDTO.getDescription());
        }

        List<Long> addDocIds = departmentUpdateDTO.getAddDoctorIds();
        List<Long> deleteDocIds = departmentUpdateDTO.getRemoveDoctorIds();

        if (addDocIds != null) {
            for (Long addDocs : addDocIds) {
                Doctor doc = doctorRepo.findById(addDocs)
                        .orElseThrow(() -> new DoctorNotFoundException("No Doctor Found"));

                doc.setDepartment(department);
                doctorRepo.save(doc);
            }
        }

        if (deleteDocIds != null) {
            for (Long delDocs : deleteDocIds) {
                Doctor doc = doctorRepo.findById(delDocs)
                        .orElseThrow(() -> new DoctorNotFoundException("No Doctor Found"));

                doc.setDepartment(null);
                doctorRepo.save(doc);
            }
        }

        return new ResponseDTO(Role.ADMIN, "Department Updated Successfully");
    }

    @Override
    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No Appointment Found"));
    }

    @Override
    @Transactional
    public ResponseDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No Appointment found"));
        if (status != null) {
            appointment.setStatus(status);
        }
        return new ResponseDTO(Role.ADMIN, "Appointment Status is Updated Successfully");
    }

    @Override
    public Page<DoctorDTO> getDoctorsByDepartment(Long departmentId, int page, int size) {
        if (!departmentRepo.existsById(departmentId))
            throw new DepartmentNotFoundException("No department found");

        return doctorRepo.findByDepartment_DepartmentId(departmentId, PageRequest.of(page, size))
                .map(commonMethods::convertToDTO);
    }

    @Override
    public Page<DoctorDTO> searchDoctor(String keyword, int page, int size) {
        return doctorRepo.searchByKeyword(keyword, PageRequest.of(page, size))
                .map(commonMethods::convertToDTO);
    }

    @Override
    public Page<PatientDTO> searchPatient(String keyword, int page, int size) {
        return patientRepo.findByUser_FirstNameContainingIgnoreCase(keyword, PageRequest.of(page, size))
                .map(patient -> mapper.map(patient, PatientDTO.class));
    }

    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByStatus(AppointmentStatus status, int page, int size) {
        return appointmentRepo.findByStatus(status, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDate", "appointmentId")))
                .map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByDoctor(Long doctorId, int page, int size) {
        return appointmentRepo.findByDoctor_doctorId(doctorId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDate", "appointmentId")))
                .map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    public Page<ReqAppointmentDTO> getAppointmentsByPatient(Long patientId, int page, int size) {
        return appointmentRepo.findByPatient_patientId(patientId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDate", "appointmentId")))
                .map(commonMethods::convertToAppointmentDTO);
    }

    @Override
    @Transactional
    public ResponseDTO updateDoctorDetails(DoctorDTO doctorates) {
        Doctor doctor = doctorRepo.findByUserEmail(doctorates.getEmail())
                .orElseThrow(
                        () -> new DoctorNotFoundException("Doctor not found with email: " + doctorates.getEmail()));
        mapper.map(doctorates, doctor);
        User user = doctor.getUser();

        if (doctorates.getFirstName() != null)
            user.setFirstName(doctorates.getFirstName());

        if (doctorates.getLastName() != null)
            user.setLastName(doctorates.getLastName());

        if (doctorates.getPhoneNumber() != null)
            user.setContactNumber(doctorates.getPhoneNumber());

        if (doctorates.getProfilePhoto() != null)
            user.setProfilePhoto(doctorates.getProfilePhoto());

        if (doctorates.getDepartmentName() != null && !doctorates.getDepartmentName().isBlank()) {
            Department department = departmentRepo.findByDepartmentNameIgnoreCase(doctorates.getDepartmentName().trim())
                    .orElseGet(() -> {
                        Department newDept = new Department();
                        newDept.setDepartmentName(doctorates.getDepartmentName().trim());
                        return departmentRepo.save(newDept);
                    });
            doctor.setDepartment(department);
        }

        if (doctorates.getLicenseNumber() != null && !doctorates.getLicenseNumber().isBlank()) {
            doctor.setLicenseNumber(doctorates.getLicenseNumber().trim());
        }

        doctorRepo.save(doctor);
        return new ResponseDTO(Role.ADMIN, "Updated Doctor Details Successfully");
    }

    @Override
    @Transactional
    public ResponseDTO updatePatientDetails(UpdatePatientDTO patientdetails) {
        return patientService.updatePatientDetails(patientdetails);
    }

    @Override
    @Transactional
    public ResponseDTO CreateDoctor(DoctorCreateDTO dto) {
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (doctorRepo.findByUserEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Doctor already exists with this email");
        }

        User user = mapper.map(dto, User.class);
        user.setContactNumber(dto.getPhoneNumber());
        user.setDob(dto.getDateOfBirth());
        user.setPassword(passwordEncoder.encode("1234"));
        user.setUser_role(Role.DOCTOR);
        userRepo.save(user);

        Doctor doctor = mapper.map(dto, Doctor.class);
        doctor.setUser(user);
        doctor.setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE);

        if (dto.getLicenseNumber() != null && !dto.getLicenseNumber().isBlank()) {
            doctor.setLicenseNumber(dto.getLicenseNumber().trim());
        } else {
            doctor.setLicenseNumber("DOC-LIC-" + System.currentTimeMillis());
        }

        Department department = null;
        if (dto.getDepartmentName() != null && !dto.getDepartmentName().isBlank()) {
            department = departmentRepo.findByDepartmentNameIgnoreCase(dto.getDepartmentName().trim())
                    .orElseGet(() -> {
                        Department newDept = new Department();
                        newDept.setDepartmentName(dto.getDepartmentName().trim());
                        return departmentRepo.save(newDept);
                    });
        } else if (dto.getDepartmentId() != null) {
            department = departmentRepo.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new DepartmentNotFoundException("Department not found with ID: " + dto.getDepartmentId()));
        }

        doctor.setDepartment(department);
        doctorRepo.save(doctor);
        return new ResponseDTO(Role.ADMIN, "Doctor created successfully");
    }

    @Override
    public List<String> getAllDepartmentNames() {
        return departmentRepo.findAllDepartmentNames();
    }

    @Override
    @Transactional
    public ResponseDTO deletePatient(Long patientId) {
        Patient patient = patientRepo.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("No Patient found"));

        User user = patient.getUser();
        patientRepo.delete(patient);
        if (user != null) {
            userRepo.delete(user);
        }
        return new ResponseDTO(Role.ADMIN, "Patient Deleted Successfully");
    }

    @Override
    @Transactional
    public ResponseDTO deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No appointment found"));
        prescriptionRepo.findByAppointmentAppointmentId(appointmentId).ifPresent(prescriptionRepo::delete);
        appointmentRepo.delete(appointment);
        return new ResponseDTO(Role.ADMIN, "Appointment deleted successfully");
    }

}
