package com.hospital.hospital_management_system.model;

import com.hospital.hospital_management_system.model.MedicineMaster;
import com.hospital.hospital_management_system.model.Prescription;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_medicine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_medicine_id")
    private Long prescriptionMedicineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private MedicineMaster medicine;

    @Column(nullable = false, length = 50)
    private String dosage;

    @Column(nullable = false, length = 50)
    private String frequency;

    @Column(nullable = false, length = 50)
    private String duration;

    @Column(length = 255)
    private String instructions;

    @Column(length = 30)
    private String quantity;
}