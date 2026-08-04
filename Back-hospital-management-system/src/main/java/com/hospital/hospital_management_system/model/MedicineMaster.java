package com.hospital.hospital_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="medicine_master")
@Data
public class MedicineMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicine_id")
    private Long medicineId;

    @Column(name = "medicine_name", nullable = false, length = 100)
    private String medicineName;

    @Column(name = "generic_name", length = 100)
    private String genericName;

    @Column(length = 100)
    private String manufacturer;

    @Column(length = 50)
    private String strength;

    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;



}