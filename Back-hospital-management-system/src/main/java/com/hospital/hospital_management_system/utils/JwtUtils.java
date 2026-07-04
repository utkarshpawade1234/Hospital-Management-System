package com.hospital.hospital_management_system.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils{
    private final long ExppirationTime=1000*60*60;
    private final String secret="my_project_of_hospital_managment_System";
    public String generateJwtToken(String username){
        return Jwts.builder().setSubject(username).
                setIssuedAt(new Date()).
                setExpiration(new Date(System.currentTimeMillis()
                        +ExppirationTime)).signWith(Keys.hmacShaKeyFor(secret.getBytes()),
                        SignatureAlgorithm.HS256).compact();

    }

    public String extractUserEmail(String token){
        return Jwts.parser().
                verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).
                build().parseSignedClaims(token).getPayload().
                getSubject();

    }
    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String email, UserDetails userDetails, String token) {
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
