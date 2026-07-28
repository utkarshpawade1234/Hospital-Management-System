package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// TODO: Planned for future pharmacy/prescription module
@Repository
public interface PrescriptionRepo extends JpaRepository<Prescription, Long> {
}
