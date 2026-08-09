package com.hospital.hospital_management_system.service;

import com.hospital.hospital_management_system.DTO.*;
import com.hospital.hospital_management_system.Exceptions.PaymentVerificationException;
import com.hospital.hospital_management_system.model.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonMethods {
    private final ModelMapper mapper;

    public ReqAppointmentDTO convertToAppointmentDTO(Appointment appointment) {
        ReqAppointmentDTO dto = new ReqAppointmentDTO();
        dto.setAppointmentId(appointment.getAppointmentId());

        if (appointment.getPatient() != null) {
            dto.setPatientId(appointment.getPatient().getPatientId());
            if (appointment.getPatient().getUser() != null) {
                String pFirst;
                pFirst = appointment.getPatient().getUser().getFirstName() != null ? appointment.getPatient().getUser().getFirstName() : "";
                String pLast = appointment.getPatient().getUser().getLastName() != null ? appointment.getPatient().getUser().getLastName() : "";
                dto.setPatientName((pFirst + " " + pLast).trim());
            }
        }

        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getDoctorId());
            if (appointment.getDoctor().getUser() != null) {
                String dFirst = appointment.getDoctor().getUser().getFirstName() != null ? appointment.getDoctor().getUser().getFirstName() : "";
                String dLast = appointment.getDoctor().getUser().getLastName() != null ? appointment.getDoctor().getUser().getLastName() : "";
                dto.setDoctorName(("Dr. " + dFirst + " " + dLast).trim());
            }
        }

        if (appointment.getDepartment() != null) {
            dto.setDepartmentName(appointment.getDepartment().getDepartmentName());
        }

        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setStartTime(appointment.getStartTime());
        dto.setEndTime(appointment.getEndTime());

        if (appointment.getAppointmentType() != null) {
            dto.setAppointmentType(appointment.getAppointmentType().name());
        }

        if (appointment.getStatus() != null) {
            dto.setStatus(appointment.getStatus().name());
        }

        if (appointment.getPaymentStatus() != null) {
            dto.setPaymentStatus(appointment.getPaymentStatus().name());
        }

        dto.setRemarks(appointment.getRemarks());
        return dto;
    }

    public DoctorDTO convertToDTO(Doctor doctor) {

        DoctorDTO dto = new DoctorDTO();

        dto.setFirstName(doctor.getUser().getFirstName());

        dto.setLastName(doctor.getUser().getLastName());

        dto.setEmail(doctor.getUser().getEmail());

        dto.setPhoneNumber(doctor.getUser().getContactNumber());

        dto.setProfilePhoto(doctor.getUser().getProfilePhoto());

        if (doctor.getDepartment() != null) {
            dto.setDepartmentId(doctor.getDepartment().getDepartmentId());
            dto.setDepartmentName(doctor.getDepartment().getDepartmentName());
        }

        dto.setDescription(doctor.getDescription());

        dto.setRoomNumber(doctor.getRoomNumber());

        dto.setAvailabilityStatus(doctor.getAvailabilityStatus());

        dto.setDoctorId(doctor.getDoctorId());

        dto.setSpecialization(doctor.getSpecialization());

        dto.setQualification(doctor.getQualification());

        dto.setYearsOfExperience(doctor.getYearsOfExperience());

        dto.setConsultationFee(doctor.getConsultationFee());

        dto.setLicenseNumber(doctor.getLicenseNumber());

        return dto;
    }


    public PrescriptionMedicineDTO convertToPrescriptionMedicineDTO(PrescriptionMedicine medicine) {

        PrescriptionMedicineDTO dto = new PrescriptionMedicineDTO();

        dto.setPrescriptionMedicineId(medicine.getPrescriptionMedicineId());

        dto.setMedicineId(medicine.getMedicine().getMedicineId());

        dto.setMedicineName(medicine.getMedicine().getMedicineName());

        dto.setDosage(medicine.getDosage());

        dto.setFrequency(medicine.getFrequency());

        dto.setDuration(medicine.getDuration());

        dto.setInstructions(medicine.getInstructions());

        dto.setQuantity(medicine.getQuantity());

        return dto;
    }

    public PrescriptionDTO convertToPrescriptionDTO(Prescription prescription) {

        PrescriptionDTO dto = mapper.map(prescription, PrescriptionDTO.class);

        if (prescription.getAppointment() != null) {
            Appointment appt = prescription.getAppointment();
            dto.setAppointmentId(appt.getAppointmentId());
            if (appt.getDoctor() != null && appt.getDoctor().getUser() != null) {
                String dFirst = appt.getDoctor().getUser().getFirstName() != null ? appt.getDoctor().getUser().getFirstName() : "";
                String dLast = appt.getDoctor().getUser().getLastName() != null ? appt.getDoctor().getUser().getLastName() : "";
                dto.setDoctorName(("Dr. " + dFirst + " " + dLast).trim());
            }
            if (appt.getAppointmentDate() != null) {
                dto.setAppointmentDate(appt.getAppointmentDate());
            }
        }

        if (prescription.getMedicines() != null) {

            dto.setMedicines(prescription.getMedicines().stream().map(this::convertToPrescriptionMedicineDTO).toList());
        }

        return dto;
    }

    public MedicineMasterDTO convertToMedicineMasterDTO(MedicineMaster medicine) {

        return mapper.map(medicine, MedicineMasterDTO.class);
    }

    public List<MedicineMasterDTO> convertToMedicineMasterDTOList(List<MedicineMaster> medicines) {

        return medicines.stream().map(this::convertToMedicineMasterDTO).toList();
    }

    public PaymentStatus getPaymentStatus(com.razorpay.Payment razorpayPayment) {

        String status = razorpayPayment.get("status").toString();

        return switch (status) {
            case "captured" -> PaymentStatus.SUCCESS;
            case "failed" -> PaymentStatus.FAILED;
            case "created" -> PaymentStatus.PENDING;
            default -> throw new PaymentVerificationException("Unknown Razorpay Payment Status : " + status);
        };
    }

    public OrderStatus getOrderStatus(PaymentStatus paymentStatus) {

        return switch (paymentStatus) {
            case SUCCESS -> OrderStatus.PAID;
            case FAILED -> OrderStatus.CANCELLED;
            case PENDING -> OrderStatus.CREATED;
            default -> throw new PaymentVerificationException("Unknown Payment Status: " + paymentStatus);
        };
    }
}


