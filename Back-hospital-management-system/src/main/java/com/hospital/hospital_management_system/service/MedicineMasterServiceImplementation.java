package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.MedicineMasterDTO;
import com.hospital.hospital_management_system.Exceptions.MedicineAlreadyExistsException;
import com.hospital.hospital_management_system.Exceptions.MedicineNotFoundException;
import com.hospital.hospital_management_system.model.MedicineMaster;
import com.hospital.hospital_management_system.repository.MedicineMasterRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.hospital.hospital_management_system.repository.PrescriptionMedicineRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicineMasterServiceImplementation implements MedicineMasterService {
    private final MedicineMasterRepository medicineMasterRepository;
    private final PrescriptionMedicineRepository prescriptionMedicineRepository;

    private final ModelMapper mapper;

    @Override
    @Transactional
    public MedicineMasterDTO addMedicine(MedicineMasterDTO dto) {
        if (medicineMasterRepository.existsByMedicineNameIgnoreCase(dto.getMedicineName())) {
            throw new MedicineAlreadyExistsException("Medicine already exists.");
        }

        MedicineMaster medicine = mapper.map(dto, MedicineMaster.class);

        medicine.setIsActive(true);

        MedicineMaster savedMedicine = medicineMasterRepository.save(medicine);

        return mapper.map(savedMedicine, MedicineMasterDTO.class);
    }

    @Override
    @Transactional
    public MedicineMasterDTO updateMedicine(Long medicineId, MedicineMasterDTO dto) {

        MedicineMaster medicine = medicineMasterRepository.findById(medicineId).orElseThrow(() -> new MedicineNotFoundException("Medicine not found."));

        if (dto.getMedicineName() != null && !dto.getMedicineName().equalsIgnoreCase(medicine.getMedicineName())) {
            if (medicineMasterRepository.existsByMedicineNameIgnoreCase(dto.getMedicineName())) {
                throw new MedicineAlreadyExistsException("Another medicine with name '" + dto.getMedicineName() + "' already exists.");
            }
            medicine.setMedicineName(dto.getMedicineName());
        }

        if (dto.getGenericName() != null) medicine.setGenericName(dto.getGenericName());

        if (dto.getManufacturer() != null) medicine.setManufacturer(dto.getManufacturer());

        if (dto.getStrength() != null) medicine.setStrength(dto.getStrength());

        if (dto.getDosageForm() != null) medicine.setDosageForm(dto.getDosageForm());

        MedicineMaster updatedMedicine = medicineMasterRepository.save(medicine);

        return mapper.map(updatedMedicine, MedicineMasterDTO.class);
    }

    @Override
    public MedicineMasterDTO getMedicineById(Long medicineId) {
        MedicineMaster medicine = medicineMasterRepository.findById(medicineId).orElseThrow(() -> new MedicineNotFoundException("Medicine not found."));

        return mapper.map(medicine, MedicineMasterDTO.class);
    }

    @Override
    public Page<MedicineMasterDTO> getAllMedicines(Pageable pageable) {
        return medicineMasterRepository.findAll(pageable).map(medicine -> mapper.map(medicine, MedicineMasterDTO.class));
    }

    @Override
    public Page<MedicineMasterDTO> searchMedicine(String keyword, Pageable pageable) {
        return medicineMasterRepository.findByMedicineNameContainingIgnoreCase(keyword, pageable).map(medicine -> mapper.map(medicine, MedicineMasterDTO.class));
    }

    @Override
    public Page<MedicineMasterDTO> getAllActiveMedicines(Pageable pageable) {
        return medicineMasterRepository.findByIsActiveTrue(pageable).map(medicine -> mapper.map(medicine, MedicineMasterDTO.class));
    }

    @Override
    public Page<MedicineMasterDTO> searchActiveMedicine(String keyword, Pageable pageable) {
        return medicineMasterRepository.findByMedicineNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable).map(medicine -> mapper.map(medicine, MedicineMasterDTO.class));
    }


    @Override
    @Transactional
    public void activateMedicine(Long medicineId) {

        MedicineMaster medicine = medicineMasterRepository.findById(medicineId).orElseThrow(() -> new MedicineNotFoundException("Medicine not found."));

        medicine.setIsActive(true);

        medicineMasterRepository.save(medicine);
    }

    @Override
    @Transactional
    public void deactivateMedicine(Long medicineId) {

        MedicineMaster medicine = medicineMasterRepository.findById(medicineId).orElseThrow(() -> new MedicineNotFoundException("Medicine not found."));

        medicine.setIsActive(false);

        medicineMasterRepository.save(medicine);
    }

    @Override
    @Transactional
    public void deleteMedicine(Long medicineId) {
        MedicineMaster medicine = medicineMasterRepository.findById(medicineId)
                .orElseThrow(() -> new MedicineNotFoundException("Medicine not found with ID: " + medicineId));

        if (prescriptionMedicineRepository.existsByMedicine_MedicineId(medicineId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete '" + medicine.getMedicineName() + "' because it is linked to existing prescriptions. Please deactivate it instead.");
        }

        medicineMasterRepository.delete(medicine);
    }

    @Override
    @Transactional
    public void deleteMultipleMedicines(List<Long> medicineIds) {
        if (medicineIds == null || medicineIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No medicine IDs provided for deletion.");
        }

        StringBuilder conflictMessage = new StringBuilder();
        int deletedCount = 0;

        for (Long id : medicineIds) {
            MedicineMaster medicine = medicineMasterRepository.findById(id).orElse(null);
            if (medicine == null) continue;

            if (prescriptionMedicineRepository.existsByMedicine_MedicineId(id)) {
                if (conflictMessage.length() > 0) conflictMessage.append(", ");
                conflictMessage.append(medicine.getMedicineName());
            } else {
                medicineMasterRepository.delete(medicine);
                deletedCount++;
            }
        }

        if (conflictMessage.length() > 0) {
            if (deletedCount > 0) {
                throw new ResponseStatusException(HttpStatus.MULTI_STATUS,
                        "Deleted " + deletedCount + " medicine(s), but could not delete: " + conflictMessage.toString() + " because they are linked to prescriptions.");
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Cannot delete selected medicine(s) [" + conflictMessage.toString() + "] because they are linked to existing prescriptions. Please deactivate them instead.");
            }
        }
    }
}
