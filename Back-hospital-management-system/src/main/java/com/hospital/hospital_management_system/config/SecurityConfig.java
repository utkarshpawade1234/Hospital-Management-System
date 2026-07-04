package com.hospital.hospital_management_system.config;

import com.hospital.hospital_management_system.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;

    /**
     * CDAC Presentation Tip: Explain SecurityFilterChain as the gatekeeper of the application.
     * It intercepts all incoming HTTP requests and applies security policies.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http
             // 1. Disable CSRF (Cross-Site Request Forgery) since REST APIs use Stateless JWT tokens instead of cookies.
             .csrf(AbstractHttpConfigurer::disable)
             
             // 2. Enable CORS (Cross-Origin Resource Sharing) so React frontend (port 5173) can call Backend (port 8080).
             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
             
             // 3. Define Endpoint Access Control Rules
             .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/patient/login",          // Publicly accessible for user login
                            "/patient/register",       // Publicly accessible for new users
                            "/patient/forgot-password", // Publicly accessible to request a password reset link
                            "/patient/reset-password",  // Publicly accessible to update password with a token
                            "/swagger-ui/**",          // Swagger UI static files for API testing
                            "/v3/api-docs/**",         // OpenAPI documentation schema endpoint
                            "/swagger-ui.html"
                    ).permitAll()                      // bypass security verification for these endpoints
                    .anyRequest().authenticated()      // All other endpoints require a valid JWT token
             )
             
             // 4. Force Stateless Session Management (Spring Boot will not create HTTP session cookies).
             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
             
             // 5. Inject our custom JwtFilter before UsernamePasswordAuthenticationFilter to validate token in each request header.
             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

       return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return new ProviderManager(daoAuthenticationProvider);
    }
}
