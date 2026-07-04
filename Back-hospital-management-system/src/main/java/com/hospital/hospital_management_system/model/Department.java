package com.hospital.hospital_management_system.model;

import jakarta.persistence.*;

import java.util.List;

@Entity(name = "department")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;

    private String departmentName;

    @OneToMany(mappedBy="department")
    private List<Doctor> doctors;
}
