package com.hospital.hospital_management_system.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String email,String firstName,String resetLink) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Hospital Management System - Password Reset");

            String html = """
                    <html>
                    
                    <body style="font-family:Arial">
                    
                    <h2>Hello %s,</h2>
                    
                    <p>
                    We received a request to reset your password.
                    </p>
                    
                    <p>
                    Click the button below.
                    </p>
                    
                    <a href="%s"
                    style="
                    background:#1976d2;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:5px;">
                    Reset Password
                    </a>
                    
                    <br><br>
                    
                    <p>
                    This link expires in 15 minutes.
                    </p>
                    
                    <p>
                    If you didn't request this,
                    simply ignore this email.
                    </p>
                    
                    <hr>
                    
                    <p>
                    
                    Hospital Management System
                    
                    </p>
                    
                    </body>
                    
                    </html>
                    """.formatted(firstName, resetLink);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Email delivery failed: " + e.getMessage());
        }
    }
}