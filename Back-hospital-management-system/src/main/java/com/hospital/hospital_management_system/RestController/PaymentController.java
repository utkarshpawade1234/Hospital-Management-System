package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<CreateOrderResponseDTO> createOrder(Principal principal, @Valid @RequestBody CreateOrderRequestDTO dto) {
        if (principal == null || principal.getName() == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        return ResponseEntity.ok(paymentService.createOrder(dto, principal.getName()));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ResponseDTO> verifyPayment(@Valid @RequestBody VerifyPaymentDTO dto) {
        return ResponseEntity.ok(paymentService.verifyPayment(dto));
    }

    @PostMapping("/refund/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> refundPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId));
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long paymentId, Principal principal) {
        if (principal == null || principal.getName() == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        return ResponseEntity.ok(paymentService.getPaymentById(paymentId, principal.getName()));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Page<PaymentResponseDTO>> getMyPaymentHistory(Principal principal, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        if (principal == null || principal.getName() == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        return ResponseEntity.ok(paymentService.getMyPaymentHistory(principal.getName(), page, size));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<Page<PaymentResponseDTO>> getPaymentsByAppointment(@PathVariable Long appointmentId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(paymentService.getPaymentsByAppointment(appointmentId, page, size));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentResponseDTO>> getAllPayments(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(paymentService.getAllPayments(page, size));
    }
}