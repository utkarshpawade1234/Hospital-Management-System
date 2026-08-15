# 🔐 Medicare - System Credentials & Password Documentation

This document documents default and pre-configured user credentials (Admin, Doctors, and Patients) in the **Medicare Hospital Management System**, verified directly from source code implementation files and the RDS database.

🌐 **Live Application**: [https://medicare-hospital.duckdns.org](https://medicare-hospital.duckdns.org)

---

## 🔑 Password Reference Summary

| User Type | Code Implementation Source | Default / Standard Password |
| :--- | :--- | :--- |
| **👑 Admin** | Database Seed | `admin123` |
| **🩺 Newly Created Doctor (`CreateDoctor` API)** | `AdminServiceImplementation.java` (Line 296) | **`1234`** |
| **🩺 Existing Demo Doctors** | Database Seed | `doctor123` |
| **👨‍⚕️ Patients (Self-Registration)** | `AuthServiceImplementation.java` (Line 54) | User Chosen Password / Default: `patient123` |

---

## 👨‍💻 Source Code Verification (`CreateDoctor` API)

When an Admin creates a new Doctor using the `CreateDoctor` API, the password is hardcoded as **`1234`** before BCrypt encoding:

```java
// File: AdminServiceImplementation.java (Lines 293-297)
User user = mapper.map(dto, User.class);
user.setContactNumber(dto.getPhoneNumber());
user.setDob(dto.getDateOfBirth());
user.setPassword(passwordEncoder.encode("1234")); // <--- Default Doctor Password: 1234
user.setUser_role(Role.DOCTOR);
userRepo.save(user);
```

---

## 👑 1. System Admin Account

| Role | Name | Email / Username | Password |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Hospital Admin | `admin@hospital.com` | `admin123` |

---

## 🩺 2. Doctor Accounts List

> **Newly Created Doctors via Admin API**: `1234`  
> **Pre-seeded Demo Doctors**: `doctor123`

| ID | Doctor Name | Specialization | Qualification | Email / Username | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4** | Dr. Amit Patel | Neurology | MBBS, MD, DM (Neurology) | `amit.patel@hospital.com` | `doctor123` / `1234` |
| **5** | Dr. Priya Iyer | Neurology | MBBS, DNB, DM (Neurology) | `priya.iyer@hospital.com` | `doctor123` / `1234` |
| **6** | Dr. Sanjay Gupta | Orthopedics | MBBS, MS (Orthopedics) | `sanjay.gupta@hospital.com` | `doctor123` / `1234` |
| **7** | Dr. Anjali Desai | Orthopedics | MBBS, DNB (Orthopedics) | `anjali.desai@hospital.com` | `doctor123` / `1234` |
| **8** | Dr. Vikram Malhotra | Pediatrics | MBBS, MD (Pediatrics) | `vikram.malhotra@hospital.com` | `doctor123` / `1234` |
| **10** | Dr. Sandeep Verma | Dermatology | MBBS, MD (Dermatology) | `sandeep.verma@hospital.com` | `doctor123` / `1234` |
| **11** | Dr. Neha Kapoor | Dermatology | MBBS, DDVL | `neha.kapoor@hospital.com` | `doctor123` / `1234` |
| **12** | Dr. Rakesh Joshi | Gynecology | MBBS, MS (Gynecology) | `rakesh.joshi@hospital.com` | `doctor123` / `1234` |
| **13** | Dr. Meenakshi Sundaram | Gynecology | MBBS, DGO, DNB | `meenakshi.sundaram@hospital.com` | `doctor123` / `1234` |
| **14** | Dr. Anil Mehta | General Medicine | MBBS, MD (General Medicine) | `anil.mehta@hospital.com` | `doctor123` / `1234` |
| **15** | Dr. Kavita Reddy | General Medicine | MBBS, MD (Internal Medicine) | `kavita.reddy@hospital.com` | `doctor123` / `1234` |
| **16** | Dr. Manoj Mishra | ENT | MBBS, MS (ENT) | `manoj.mishra@hospital.com` | `doctor123` / `1234` |
| **17** | Dr. Shalini Hegde | ENT | MBBS, DLO | `shalini.hegde@hospital.com` | `doctor123` / `1234` |
| **18** | Dr. Harish Nair | Ophthalmology | MBBS, MS (Ophthalmology) | `harish.nair@hospital.com` | `doctor123` / `1234` |
| **19** | Dr. Pooja Bhatia | Ophthalmology | MBBS, DOMS | `pooja.bhatia@hospital.com` | `doctor123` / `1234` |
| **20** | Dr. Devendra Singh | Psychiatry | MBBS, MD (Psychiatry) | `devendra.singh@hospital.com` | `doctor123` / `1234` |
| **21** | Dr. Divya Saxena | Psychiatry | MBBS, DPM | `divya.saxena@hospital.com` | `doctor123` / `1234` |
| **51** | Dr. Arjav Acro | Cardiology | MBBS, MD, DM | `arjav@gmail.com` | `doctor123` / `1234` |
| **53** | Dr. Hon Smith | Cardiology | MBBS | `hon@gmail.com` | `doctor123` / `1234` |

---

## 👨‍⚕️ 3. Patient Accounts List

> **Pre-seeded Patient Password**: `patient123`

| ID | Patient Name | Email Address | Password |
| :--- | :--- | :--- | :--- |
| **22** | Aarav Sharma | `aarav.sharma@gmail.com` | `patient123` |
| **23** | Vihaan Patel | `vihaan.patel@gmail.com` | `patient123` |
| **24** | Aditya Verma | `aditya.verma@gmail.com` | `patient123` |
| **25** | Arjun Kapoor | `arjun.kapoor@gmail.com` | `patient123` |
| **26** | Sai Reddy | `sai.reddy@gmail.com` | `patient123` |
| **27** | Reyansh Joshi | `reyansh.joshi@gmail.com` | `patient123` |
| **28** | Ishaan Nair | `ishaan.nair@gmail.com` | `patient123` |
| **29** | Krishna Iyer | `krishna.iyer@gmail.com` | `patient123` |
| **30** | Aanya Rao | `aanya.rao@gmail.com` | `patient123` |
| **31** | Diya Gupta | `diya.gupta@gmail.com` | `patient123` |
| **32** | Pihu Mehta | `pihu.mehta@gmail.com` | `patient123` |
| **33** | Prisha Saxena | `prisha.saxena@gmail.com` | `patient123` |
| **34** | Ananya Kumar | `ananya.kumar@gmail.com` | `patient123` |
| **35** | Riya Sharma | `riya.sharma@gmail.com` | `patient123` |
| **36** | Advik Bhatia | `advik.bhatia@gmail.com` | `patient123` |
| **37** | Atharv Mishra | `atharv.mishra@gmail.com` | `patient123` |
| **38** | Ishita Desai | `ishita.desai@gmail.com` | `patient123` |
| **39** | Kavya Hegde | `kavya.hegde@gmail.com` | `patient123` |
| **40** | Shaurya Singh | `shaurya.singh@gmail.com` | `patient123` |
| **41** | Vivaan Malhotra | `vivaan.malhotra@gmail.com` | `patient123` |
| **42** | Rituraj Shirdhone | `rutujashirdhone@gmail.com` | `patient123` |
| **43** | Utkarsh Pawade | `utkarshpawade9@gmail.com` | `patient123` |
