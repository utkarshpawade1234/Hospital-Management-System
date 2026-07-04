package com.hospital.hospital_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="password_reset_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Random token sent in the email
    @Column(nullable = false, unique = true)
    private String token;

    // Expiry time (e.g., 15 minutes)
    @Column(nullable = false)
    private LocalDateTime expiryTime;

    // Whether the token has already been used
    @Column(nullable = false)
    private boolean used;

    // The user this token belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}