package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.Exceptions.*;
import com.hospital.hospital_management_system.config.RazorpayConfig;
import com.hospital.hospital_management_system.model.*;
import com.hospital.hospital_management_system.repository.AppointmentRepo;
import com.hospital.hospital_management_system.repository.PatientRepo;
import com.hospital.hospital_management_system.repository.PaymentRepository;
import com.hospital.hospital_management_system.repository.UserRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class PaymentServiceImplementation implements PaymentService {

    private final RazorpayConfig razorpayConfig;
    private final ModelMapper mapper;
    private final AppointmentRepo appointmentRepo;
    private final PatientRepo patientRepo;
    private final PaymentRepository paymentRepository;
    private final UserRepo userRepo;
    private final CommonMethods commonMethods;
    @Value("${hospital.service.fee}")
    private BigDecimal hospitalServiceFee;

    @Override
    @Transactional
    public synchronized CreateOrderResponseDTO createOrder(CreateOrderRequestDTO dto, String email) {
        if (dto == null || dto.getAppointmentId() == null) {
            throw new IllegalArgumentException("Appointment ID must not be null");
        }

        Appointment appointment = appointmentRepo.findById(dto.getAppointmentId())
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment Exists"));

        Patient patient = appointment.getPatient();
        if (email == null || patient == null || patient.getUser() == null
                || !patient.getUser().getEmail().equalsIgnoreCase(email.trim())) {
            throw new AccessDeniedException("You are not authorized to pay for this appointment.");
        }

        Doctor doctor = appointment.getDoctor();
        if (doctor == null) {
            throw new IllegalArgumentException("Doctor associated with this appointment not found");
        }

        paymentRepository.findFirstByAppointmentAndPaymentStatusOrderByPaymentIdDesc(appointment, PaymentStatus.SUCCESS)
                .ifPresent(payment -> {
                    throw new PaymentAlreadyDoneException("Payment is already done");
                });

        Optional<Payment> existingPending = paymentRepository.findFirstByAppointmentAndPaymentStatusOrderByPaymentIdDesc(appointment, PaymentStatus.PENDING);
        if (existingPending.isPresent()) {
            Payment pendingPayment = existingPending.get();
            CreateOrderResponseDTO responseDTO = mapper.map(pendingPayment, CreateOrderResponseDTO.class);
            responseDTO.setRazorpayKey(razorpayConfig.getKeyId());
            return responseDTO;
        }

        double feeVal = doctor.getConsultationFee();
        BigDecimal consultationFee = BigDecimal.valueOf(feeVal);
        BigDecimal serviceFee = hospitalServiceFee != null ? hospitalServiceFee : BigDecimal.ZERO;
        BigDecimal amt = consultationFee.add(serviceFee);

        String receiptNum = "REC-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        JSONObject options = new JSONObject();
        options.put("amount", amt.multiply(BigDecimal.valueOf(100)).intValue());
        options.put("currency", "INR");
        options.put("receipt", receiptNum);
        Order order;
        try {
            order = razorpayConfig.getRazorPayClient().orders.create(options);
        } catch (RazorpayException e) {
            throw new PaymentGatewayException("Unable to create Razorpay Order: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new PaymentGatewayException("Razorpay Configuration/Network error: " + e.getMessage(), e);
        }

        Payment payment1 = new Payment();
        payment1.setCurrency(order.get("currency").toString());
        payment1.setReceiptNumber(order.get("receipt").toString());
        payment1.setDoctor(doctor);
        payment1.setAppointment(appointment);
        payment1.setPatient(patient);
        payment1.setAmount(amt);
        payment1.setRazorpayOrderId(order.get("id").toString());
        payment1.setOrderStatus(OrderStatus.CREATED);
        payment1.setPaymentStatus(PaymentStatus.PENDING);

        Payment savePayment = paymentRepository.save(payment1);

        CreateOrderResponseDTO responseDTO = mapper.map(savePayment, CreateOrderResponseDTO.class);
        responseDTO.setRazorpayKey(razorpayConfig.getKeyId());

        return responseDTO;
    }

    @Override
    @Transactional
    public ResponseDTO verifyPayment(VerifyPaymentDTO dto) {
        Payment payment = paymentRepository.findByRazorpayOrderId(dto.getRazorpayOrderId())
                .orElseThrow(() -> new PaymentNotFoundException("No Such Payment Found"));

        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            throw new PaymentAlreadyDoneException(
                    "Payment Already Verified");
        }

        JSONObject attributes = new JSONObject();

        attributes.put("razorpay_order_id", dto.getRazorpayOrderId());

        attributes.put("razorpay_payment_id", dto.getRazorpayPaymentId());

        attributes.put("razorpay_signature", dto.getRazorpaySignature());

        com.razorpay.Payment razorpayPayment;
        try {
            Utils.verifyPaymentSignature(attributes, razorpayConfig.getSecretKey());

            razorpayPayment = razorpayConfig.getRazorPayClient().payments.fetch(dto.getRazorpayPaymentId());

        } catch (RazorpayException e) {
            throw new PaymentVerificationException("Invalid payment signature", e);
        }
        payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());

        payment.setRazorpaySignature(dto.getRazorpaySignature());

        PaymentStatus paymentStatus = commonMethods.getPaymentStatus(razorpayPayment);

        payment.setPaymentStatus(paymentStatus);

        payment.setOrderStatus(commonMethods.getOrderStatus(paymentStatus));

        if (paymentStatus == PaymentStatus.SUCCESS) {
            payment.setPaidAt(LocalDateTime.now());
            if (payment.getAppointment() != null) {
                payment.getAppointment().setPaymentStatus(PaymentStatus.SUCCESS);
                payment.getAppointment().setStatus(AppointmentStatus.CONFIRMED);
                appointmentRepo.save(payment.getAppointment());
            }
        }

        String method = razorpayPayment.get("method").toString();

        payment.setPaymentMethod(PaymentMethod.valueOf(method.toUpperCase()));

        paymentRepository.save(payment);

        if (paymentStatus == PaymentStatus.SUCCESS) {
            return new ResponseDTO(null, "Payment Successful");
        }

        return new ResponseDTO(null, "Payment Failed");
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long paymentId, String email) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("No such Payment Found"));

        User user = userRepo.findByEmail(email).orElse(null);
        boolean isAdmin = user != null && user.getUser_role() == Role.ADMIN;
        boolean isPatient = payment.getPatient().getUser().getEmail().equalsIgnoreCase(email);
        boolean isDoctor = payment.getDoctor().getUser().getEmail().equalsIgnoreCase(email);

        if (!isAdmin && !isPatient && !isDoctor) {
            throw new AccessDeniedException("You are not authorized to view this payment.");
        }

        PaymentResponseDTO paymentResponseDTO = mapper.map(payment, PaymentResponseDTO.class);
        if (payment.getAppointment() != null) {
            paymentResponseDTO.setAppointmentStatus(payment.getAppointment().getStatus());
        }
        paymentResponseDTO.setPatientName(payment.getPatient().getUser().getFirstName() + " " + payment.getPatient().getUser().getLastName());
        paymentResponseDTO.setDoctorName(payment.getDoctor().getUser().getFirstName() + " " + payment.getDoctor().getUser().getLastName());
        return paymentResponseDTO;
    }

    @Override
    public Page<PaymentResponseDTO> getMyPaymentHistory(String email, int page, int size) {
        Patient patient = patientRepo.findByUserEmail(email)
                .orElseThrow(() -> new PatientNotFoundException("Patient record not found for user: " + email));
        Page<Payment> payments = paymentRepository.findByPatient(patient, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt", "paymentId")));
        return payments.map(payment -> {
            PaymentResponseDTO dto = mapper.map(payment, PaymentResponseDTO.class);
            if (payment.getAppointment() != null) {
                dto.setAppointmentStatus(payment.getAppointment().getStatus());
            }
            dto.setPatientName(payment.getPatient().getUser().getFirstName() + " " + payment.getPatient().getUser().getLastName());
            dto.setDoctorName(payment.getDoctor().getUser().getFirstName() + " " + payment.getDoctor().getUser().getLastName());
            return dto;
        });
    }

    @Override
    @Transactional
    public Page<PaymentResponseDTO> getPaymentsByAppointment(Long appointmentId, int page, int size) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("No such Appointment"));
        return paymentRepository.findByAppointmentOrderByPaymentIdDesc(appointment, PageRequest.of(page, size))
                .map(payment -> {
                    PaymentResponseDTO dto = mapper.map(payment, PaymentResponseDTO.class);
                    if (payment.getAppointment() != null) {
                        dto.setAppointmentStatus(payment.getAppointment().getStatus());
                    }
                    dto.setPatientName(payment.getPatient().getUser().getFirstName() + " " + payment.getPatient().getUser().getLastName());
                    dto.setDoctorName(payment.getDoctor().getUser().getFirstName() + " " + payment.getDoctor().getUser().getLastName());
                    return dto;
                });
    }

    @Override
    public Page<PaymentResponseDTO> getAllPayments(int page, int size) {
        return paymentRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "paymentId")))
                .map(payment -> {
                    PaymentResponseDTO dto = mapper.map(payment, PaymentResponseDTO.class);
                    if (payment.getAppointment() != null) {
                        dto.setAppointmentStatus(payment.getAppointment().getStatus());
                    }
                    dto.setPatientName(payment.getPatient().getUser().getFirstName() + " " + payment.getPatient().getUser().getLastName());
                    dto.setDoctorName(payment.getDoctor().getUser().getFirstName() + " " + payment.getDoctor().getUser().getLastName());
                    return dto;
                });
    }

    @Override
    @Transactional
    public ResponseDTO refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("No such Payment Found"));

        if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
            throw new PaymentGatewayException("Payment is not successful. Only successful payments can be refunded.");
        }

        Appointment appointment = payment.getAppointment();
        if (appointment != null && appointment.getStatus() != AppointmentStatus.CANCELLED) {
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepo.save(appointment);
        }

        if (payment.getRefundStatus() == RefundStatus.PROCESSED || payment.getPaymentStatus() == PaymentStatus.REFUNDED) {
            throw new PaymentAlreadyDoneException("Refund already processed.");
        }

        BigDecimal refundAmt = payment.getAmount();
        payment.setRefundStatus(RefundStatus.PENDING);
        paymentRepository.save(payment);

        String refundId = "rfnd_" + System.currentTimeMillis();
        if (payment.getRazorpayPaymentId() != null && !payment.getRazorpayPaymentId().isEmpty()) {
            try {
                JSONObject request = new JSONObject();
                request.put("amount", refundAmt.multiply(BigDecimal.valueOf(100)).intValue());
                Refund refund = razorpayConfig.getRazorPayClient().payments.refund(payment.getRazorpayPaymentId(), request);
                if (refund != null && refund.has("id")) {
                    refundId = refund.get("id").toString();
                }
            } catch (Exception e) {

            }
        }

        payment.setRefundId(refundId);
        payment.setRefundStatus(RefundStatus.PROCESSED);
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundAmount(refundAmt);
        paymentRepository.save(payment);

        return new ResponseDTO("Refund processed successfully");
    }



}
