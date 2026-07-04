package com.hospital.hospital_management_system.filter;

import com.hospital.hospital_management_system.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
   private final  JwtUtils jwtUtils;
   private final UserDetailsService userDetailsService;
    /**
     * CDAC Presentation Tip: OncePerRequestFilter guarantees that this filter executes 
     * exactly once for every incoming HTTP request.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. Extract the Authorization Header from the incoming HTTP Request
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;
        
        try {
            // 2. JWTs are prefixed with "Bearer " (7 characters including space)
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
               token = authHeader.substring(7); // Extract the actual token string
               email = jwtUtils.extractUserEmail(token); // Decode the payload claims to extract user's email
            }
        } catch (Exception e) {
            // Ignore exception to let the filter chain proceed and reject as unauthorized if authentication is missing
        }

        // 3. If email is extracted and user is not already authenticated in the current security context...
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 4. Load the user entity details from the database using UserDetailsService
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            // 5. Check if the token's credentials match the UserDetails and token is not expired
            if (jwtUtils.validateToken(email, userDetails, token)) {
                // 6. Create UsernamePasswordAuthenticationToken containing user details and roles (authorities)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 7. Store the verified authentication token inside Spring Security Context.
                // This makes the user successfully "logged in" for the duration of this request.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 8. Pass control to the next filter in the spring security filter chain
        filterChain.doFilter(request, response);
    }
}
