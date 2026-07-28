package com.hospital.hospital_management_system.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Doctor {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctorid")
    private Long doctorId;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private Integer yearsOfExperience;

    @Column(nullable = false)
    private Double consultationFee;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    private Integer roomNumber;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name="department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;




    public enum AvailabilityStatus {
        AVAILABLE,
        NOT_AVAILABLE,
        ON_LEAVE
    }

}