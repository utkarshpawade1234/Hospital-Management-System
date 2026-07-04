package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.model.User;
import com.hospital.hospital_management_system.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserDetailsServiceImplementation  implements UserDetailsService {

    private final UserRepo userrepo;
    private final ModelMapper map;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return  userrepo.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("User not found within the records"));
    }


}
