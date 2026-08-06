package com.hospital.hospital_management_system.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class HospitalManagementGlobalExceptionHandler {



    @ExceptionHandler({
            DoctorNotFoundException.class,
            PatientNotFoundException.class,
            UserNotFoundException.class,
            DepartmentNotFoundException.class,
            MedicineNotFoundException.class,
            AppointmentNotFoundException.class,
            PrescriptionNotFoundException.class,
            PaymentNotFoundException.class
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse handleNotFoundException(RuntimeException ex) {
        return new ApiResponse(ex.getMessage());
    }


    @ExceptionHandler({
            AppointmentAlreadyExistsException.class,
            MedicineAlreadyExistsException.class,
            PrescriptionAlreadyExistsException.class,
            DoctorUnavailableException.class,
            FileUploadException.class,
            IllegalArgumentException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleBadRequestException(RuntimeException ex) {
        return new ApiResponse(ex.getMessage());
    }

    @ExceptionHandler({
            PaymentGatewayException.class,
            PaymentAlreadyDoneException.class,
            PaymentVerificationException.class,

    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handlePaymentException(RuntimeException ex) {
        return new ApiResponse(ex.getMessage());
    }


    @ExceptionHandler({BadCredentialsException.class, AuthenticationException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse handleAuthenticationException() {
        return new ApiResponse("Invalid email or password");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse handleAccessDenied(AccessDeniedException ex) {
        return new ApiResponse(ex.getMessage());
    }



    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .reduce((msg1, msg2) -> msg1 + "; " + msg2)
                .orElse("Validation failed");

        return new ApiResponse(errorMessage);
    }


    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(new ApiResponse(ex.getReason()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse handleGenericException(Exception ex) {
        String message = (ex.getMessage() != null && !ex.getMessage().isBlank())
                ? ex.getMessage()
                : "An unexpected error occurred";
        return new ApiResponse(message);
    }
}


