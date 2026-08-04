package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.PrescriptionDTO;
import com.hospital.hospital_management_system.DTO.PrescriptionMedicineDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import com.hospital.hospital_management_system.Exceptions.*;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PrescriptionServiceImplementation implements  PrescriptionService{
    private final PrescriptionRepo prescriptionRepository;

    private final CommonMethods commonMethods;

    private final PrescriptionMedicineRepository prescriptionMedicineRepository;

    private final MedicineMasterRepository medicineMasterRepository;

    private final AppointmentRepo appointmentRepository;

    private  final PatientRepo patientRepo;

    private final DoctorRepo doctorRepo;

    private final PatientRepo patientRepository;

    private final UserRepo userRepo;

    private final ModelMapper mapper;

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(String doctorEmail, Long appointmentId, PrescriptionDTO dto) {
        com.hospital.hospital_management_system.model.Appointment appointment = appointmentRepository.findByDoctorUserEmailAndAppointmentId(doctorEmail, appointmentId)
                .orElseThrow(() -> new NoSuchAppointmentException("No such appointment found for this doctor"));

        if (appointment.getStatus() != com.hospital.hospital_management_system.model.AppointmentStatus.CONFIRMED && 
            appointment.getStatus() != com.hospital.hospital_management_system.model.AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Prescription can only be written for CONFIRMED or COMPLETED appointments.");
        }

        if (prescriptionRepository.existsByAppointmentAppointmentId(appointmentId)) {
            throw new PrescriptionAlreadyExistsException("Prescription already exists for this appointment.");
        }

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setNotes(dto.getNotes());

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        if (dto.getMedicines() != null && !dto.getMedicines().isEmpty()) {
            for (PrescriptionMedicineDTO medicineDTO : dto.getMedicines()) {
                MedicineMaster medicineMaster = medicineMasterRepository.findById(medicineDTO.getMedicineId())
                        .orElseThrow(() -> new MedicineNotFoundException("Medicine with ID " + medicineDTO.getMedicineId() + " not found."));

                PrescriptionMedicine prescriptionMedicine = new PrescriptionMedicine();
                prescriptionMedicine.setPrescription(savedPrescription);
                prescriptionMedicine.setMedicine(medicineMaster);
                prescriptionMedicine.setDosage(medicineDTO.getDosage());
                prescriptionMedicine.setFrequency(medicineDTO.getFrequency());
                prescriptionMedicine.setDuration(medicineDTO.getDuration());
                prescriptionMedicine.setInstructions(medicineDTO.getInstructions());
                prescriptionMedicine.setQuantity(medicineDTO.getQuantity());

                prescriptionMedicineRepository.save(prescriptionMedicine);
            }
        }

        return commonMethods.convertToPrescriptionDTO(savedPrescription);
    }

    @Override
    public Page<PrescriptionDTO> getAllPrescriptions(Pageable pageable) {
        return prescriptionRepository.findAll(pageable).map(commonMethods::convertToPrescriptionDTO);
    }

    @Override
    public PrescriptionDTO getPrescriptionById(Long prescriptionId) {
        Prescription prescription= prescriptionRepository.findById(prescriptionId).orElseThrow(()->new PrescriptionNotFoundException("No Such Prescription found"));
       return  commonMethods.convertToPrescriptionDTO(prescription);
    }

    @Override
    @Transactional
    public PrescriptionDTO updatePrescription(Long prescriptionId, PrescriptionDTO dto) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(()->new PrescriptionNotFoundException("No Prescription Found"));

        prescription.setDiagnosis(dto.getDiagnosis());

        prescription.setNotes(dto.getNotes());

        Prescription savedPrescription=prescriptionRepository.save(prescription);

        return commonMethods.convertToPrescriptionDTO(savedPrescription);
    }

    @Override
    public ResponseDTO deletePrescription(Long prescriptionId) {
        prescriptionRepository.deleteById(prescriptionId);
        return new ResponseDTO(null,"Prescriptoni Succesfully added");
    }

    @Override
    @Transactional
    public PrescriptionMedicineDTO addMedicine(Long prescriptionId, PrescriptionMedicineDTO dto) {
        Prescription prescription=prescriptionRepository.findById(prescriptionId).orElseThrow(()->new PrescriptionNotFoundException("No Such Prescriptoin Found"));

        MedicineMaster medicine = medicineMasterRepository.findById(dto.getMedicineId()).orElseThrow(() -> new MedicineNotFoundException("Medicine not found"));

        PrescriptionMedicine prescriptionMedicine = mapper.map(dto, PrescriptionMedicine.class);

        prescriptionMedicine.setPrescription(prescription);
        prescriptionMedicine.setMedicine(medicine);

        PrescriptionMedicine saved =
                prescriptionMedicineRepository.save(prescriptionMedicine);

        return commonMethods.convertToPrescriptionMedicineDTO(saved);
    }

    @Override
    public Page<PrescriptionMedicineDTO> getMedicinesByPrescription(Long prescriptionId,int page,int size) {
        return prescriptionMedicineRepository.findByPrescriptionPrescriptionId(prescriptionId, PageRequest.of(page,size)).map(commonMethods::convertToPrescriptionMedicineDTO);
    }

    @Override
    @Transactional
    public PrescriptionMedicineDTO updateMedicine(Long prescriptionId, Long prescriptionMedicineId, PrescriptionMedicineDTO dto) {
        PrescriptionMedicine medicine = prescriptionMedicineRepository.findById(prescriptionMedicineId).orElseThrow(()->new MedicineNotFoundException("No such Medicine found Exceptoin"));

        if (!medicine.getPrescription()
                .getPrescriptionId()
                .equals(prescriptionId)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Medicine doesn't belong to this prescription");
        }

        mapper.map(dto, medicine);

        PrescriptionMedicine updated = prescriptionMedicineRepository.save(medicine);

        return commonMethods.convertToPrescriptionMedicineDTO(updated);
    }

    @Override
    @Transactional
    public ResponseDTO deleteMedicine(Long prescriptionId, Long prescriptionMedicineId) {
        Prescription prescription=prescriptionRepository.findById(prescriptionId).orElseThrow(()->new NoSuchPrescriptionAvailableException("No Such Prescription Found"));

        PrescriptionMedicine prescriptionMedicine=prescriptionMedicineRepository.findById(prescriptionMedicineId).orElseThrow(()->new MedicineNotFoundException("No such Medicine Found"));

        prescription.getMedicines().remove(prescriptionMedicine);
        prescriptionMedicineRepository.delete(prescriptionMedicine);

        return new ResponseDTO(null, "Medicine removed successfully");
    }

    @Override
    public Page<PrescriptionDTO> getDoctorPrescriptions(String doctorEmail,int page,int size) {
        return prescriptionRepository.findByAppointmentDoctorUserEmail(doctorEmail,PageRequest.of(page,size)).map(commonMethods::convertToPrescriptionDTO);
    }

    @Override
    public Page<PrescriptionDTO> searchPrescriptionsByPatientName(String patientName, Pageable pageable) {

        return prescriptionRepository.searchByPatientName(patientName, pageable).map(commonMethods::convertToPrescriptionDTO);
    }

    @Override
    public Page<PrescriptionDTO> getPatientPrescriptions(String patientEmail, Pageable pageable) {
        Patient patient=patientRepo.findByUserEmail(patientEmail).orElseThrow(()->new PatientNotFoundException("No such Patient Found"));
        return prescriptionRepository.findByAppointmentPatientPatientId(patient.getPatientId(),pageable).map(commonMethods::convertToPrescriptionDTO);
    }

    @Override
    public PrescriptionDTO getPatientPrescription(Long prescriptionId, String patientEmail) {

        Prescription prescription=prescriptionRepository.findById(prescriptionId).orElseThrow(()->new PrescriptionNotFoundException("No Prescription Found"));

        if(!prescription.getAppointment().getPatient().getUser().getEmail().equals(patientEmail))
                      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This Prescription does not belong to this Patient");



        return commonMethods.convertToPrescriptionDTO(prescription);
    }

    @Override
    public PrescriptionDTO getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription= prescriptionRepository.findByAppointmentAppointmentId(appointmentId).orElseThrow(()->new PrescriptionNotFoundException("No such Prescription Found"));
        return commonMethods.convertToPrescriptionDTO(prescription);
    }




    @Override
    public Page<PrescriptionDTO> getPrescriptionsForPatient(String patientEmail,int page,int size) {
        Patient patient=patientRepo.findByUserEmail(patientEmail).orElseThrow(()->new PatientNotFoundException("No Pateint Found)"));
        return  prescriptionRepository.findByAppointmentPatientPatientId(patient.getPatientId(),PageRequest.of(page,size)).map(commonMethods::convertToPrescriptionDTO);
    }
}
