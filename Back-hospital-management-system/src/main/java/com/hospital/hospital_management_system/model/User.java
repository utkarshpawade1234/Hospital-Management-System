package com.hospital.hospital_management_system.model;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid",unique = true)
    private  Long user_id;

    @Column(length = 30)
    private String firstName;

    @Column(length = 30)
    private String lastName;

    @Column(name = "email",unique = true,nullable = false)
    private String email;

    @Column(name="contactdetails",length = 10,updatable = true,nullable = false)
    private String contactNumber;

    @Column(name="password",nullable = false,updatable = true)
    private String password;

    @Column(length = 255)
    private String address;

    @Column(name = "profile_photo")
    private String profilePhoto;


    @Column(name="date_of_birth",nullable = false)
    private LocalDate dob;

    @CreationTimestamp
    @Column(name = "timeofcreation",updatable = false,nullable = false)
    private LocalDateTime time_of_creation;


    @Enumerated(EnumType.STRING)
    @Column(name = "UserRole")
    private Role user_role;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user_role.name())
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
