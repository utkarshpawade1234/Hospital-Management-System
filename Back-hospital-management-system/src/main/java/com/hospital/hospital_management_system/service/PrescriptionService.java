package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.PrescriptionDTO;
import com.hospital.hospital_management_system.DTO.PrescriptionMedicineDTO;
import com.hospital.hospital_management_system.DTO.ResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrescriptionService {
    PrescriptionDTO createPrescription(String doctorEmail, Long appointmentId, PrescriptionDTO dto);

    Page<PrescriptionDTO> getAllPrescriptions(Pageable pageable);

    PrescriptionDTO getPrescriptionById(Long prescriptionId);

    PrescriptionDTO updatePrescription(Long prescriptionId, PrescriptionDTO dto);

    ResponseDTO deletePrescription(Long prescriptionId);

    PrescriptionMedicineDTO addMedicine(Long prescriptionId, PrescriptionMedicineDTO dto);

    Page<PrescriptionMedicineDTO> getMedicinesByPrescription(Long prescriptionId, int page, int size);

    public Page<PrescriptionDTO> searchPrescriptionsByPatientName(String patientName, Pageable pageable);

    PrescriptionMedicineDTO updateMedicine(Long prescriptionId, Long prescriptionMedicineId, PrescriptionMedicineDTO dto);

    ResponseDTO deleteMedicine(Long prescriptionId, Long prescriptionMedicineId);

    Page<PrescriptionDTO> getDoctorPrescriptions(String doctorEmail, int page, int size);

    Page<PrescriptionDTO> getPatientPrescriptions(String patientEmail, Pageable pageable);

    PrescriptionDTO getPatientPrescription(Long prescriptionId, String patientEmail);

    PrescriptionDTO getPrescriptionByAppointmentId(Long appointmentId);

    PrescriptionDTO getDoctorPrescriptionByAppointmentId(String doctorEmail, Long appointmentId);

    PrescriptionDTO getPatientPrescriptionByAppointmentId(String patientEmail, Long appointmentId);

    public Page<PrescriptionDTO> getPrescriptionsForPatient(String patientEmail, int page, int size);
}
