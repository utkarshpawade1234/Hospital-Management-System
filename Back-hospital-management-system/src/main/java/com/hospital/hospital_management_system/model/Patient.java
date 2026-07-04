package com.hospital.hospital_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "emergency_contact_name", length = 50)
    private String emergencyContactName;

    @Column(name = "emergency_contact_number", length = 15)
    private String emergencyContactNumber;

    @Column(name = "emergency_contact_relation", length = 20)
    private String emergencyContactRelation;

    @Column(name="description")
    private String description;


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

}