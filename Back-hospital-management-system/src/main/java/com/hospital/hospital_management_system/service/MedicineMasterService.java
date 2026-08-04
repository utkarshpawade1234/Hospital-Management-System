package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.MedicineMasterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MedicineMasterService {

    MedicineMasterDTO addMedicine(MedicineMasterDTO dto);

    MedicineMasterDTO updateMedicine(
            Long medicineId,
            MedicineMasterDTO dto);

    MedicineMasterDTO getMedicineById(Long medicineId);

    Page<MedicineMasterDTO> getAllMedicines(Pageable pageable);

    Page<MedicineMasterDTO> searchMedicine(String keyword, Pageable pageable);

    Page<MedicineMasterDTO> getAllActiveMedicines(Pageable pageable);

    Page<MedicineMasterDTO> searchActiveMedicine(String keyword, Pageable pageable);

    void activateMedicine(Long medicineId);

    void deactivateMedicine(Long medicineId);
}
