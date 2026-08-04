package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.MedicineMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicineMasterRepository
        extends JpaRepository<MedicineMaster, Long> {

    Optional<MedicineMaster> findByMedicineNameIgnoreCase(String medicineName);

    Page<MedicineMaster> findByIsActiveTrue(Pageable pageable);

    Page<MedicineMaster> findByMedicineNameContainingIgnoreCaseAndIsActiveTrue(
            String keyword,
            Pageable pageable
    );

    Page<MedicineMaster> findByMedicineNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    boolean existsByMedicineNameIgnoreCase(String medicineName);
}