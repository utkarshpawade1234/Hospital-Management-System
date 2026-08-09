package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.MedicineMasterDTO;
import com.hospital.hospital_management_system.service.MedicineMasterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/medicines")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MedicineMasterController {

    private final MedicineMasterService medicineMasterService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MedicineMasterDTO> addMedicine(@RequestBody MedicineMasterDTO dto) {
        MedicineMasterDTO response = medicineMasterService.addMedicine(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{medicineId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MedicineMasterDTO> updateMedicine(@PathVariable Long medicineId, @RequestBody MedicineMasterDTO dto) {
        MedicineMasterDTO response = medicineMasterService.updateMedicine(medicineId, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{medicineId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MedicineMasterDTO> getMedicineById(@PathVariable Long medicineId) {
        MedicineMasterDTO response = medicineMasterService.getMedicineById(medicineId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MedicineMasterDTO>> getAllMedicines(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<MedicineMasterDTO> response = medicineMasterService.getAllMedicines(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MedicineMasterDTO>> searchMedicine(@RequestParam String keyword, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<MedicineMasterDTO> response = medicineMasterService.searchMedicine(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{medicineId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateMedicine(@PathVariable Long medicineId) {
        medicineMasterService.activateMedicine(medicineId);
        return ResponseEntity.ok("Medicine activated successfully.");
    }

    @PutMapping("/{medicineId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateMedicine(@PathVariable Long medicineId) {
        medicineMasterService.deactivateMedicine(medicineId);
        return ResponseEntity.ok("Medicine deactivated successfully.");
    }
}
