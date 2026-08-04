package com.hospital.hospital_management_system.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import  com.hospital.hospital_management_system.model.*;
import java.util.Optional;

public interface PrescriptionMedicineRepository
        extends JpaRepository<PrescriptionMedicine, Long> {

    Page<PrescriptionMedicine> findByPrescriptionPrescriptionId(
            Long prescriptionId, Pageable pageable);

    Optional<PrescriptionMedicine> findByPrescriptionMedicineIdAndPrescriptionPrescriptionId(
            Long prescriptionMedicineId,
            Long prescriptionId);

    void deleteByPrescriptionMedicineIdAndPrescriptionPrescriptionId(
            Long prescriptionMedicineId,
            Long prescriptionId);
}