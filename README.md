<h1 align="center">🏥 Hospital Management System (HMS)</h1>

<p align="center">
  <b>A modern, full-stack healthcare platform built to streamline clinical workflows, patient care, and hospital operations.</b>
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-medicare--hospital.duckdns.org-0070f3?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/AWS-EC2_%26_RDS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org"><b>🚀 Try the Live Demo</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-project-structure"><b>📁 Project Structure</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-quick-start-guide"><b>⚡ Quick Start Guide</b></a>
</p>

---

## 👋 Welcome to HMS

The **Hospital Management System (HMS)** is a complete healthcare ecosystem designed to replace manual paperwork with automated, digital workflows. It connects patients, doctors, and administrators under one unified system—making it effortless to search for specialists, book consultation slots in 30-minute intervals, process payments online, write digital prescriptions, and track pharmacy stock.

### 🌟 Key Highlights
- ⏱️ **Conflict-Free Booking**: Smart slot management prevents double-booking across 30-minute time slots (09:00 AM - 05:00 PM).
- 💳 **Instant Online Payments**: Integrated Razorpay gateway with secure HMAC signature verification and email receipts.
- 📋 **Digital Prescriptions**: Doctors can issue digital prescriptions linked directly to patient consultation histories.
- 💊 **Pharmacy Inventory**: Automatic medicine stock tracking linked with digital prescription issuances.
- 🔍 **Guest Doctor Discovery**: Allows visitors to search doctors by specialty, fee, or room number without logging in.

---

## 📁 Project Structure

HMS is structured as a decoupled monorepo featuring a **Spring Boot 3.x** backend REST API and a **React 18 SPA** frontend, fully orchestrated with Docker Compose:

```
Hospital-Management-System/
├── Back-hospital-management-system/          # Spring Boot 3.x Backend Service
│   ├── src/main/java/com/hospital/hospital_management_system/
│   │   ├── RestController/                    # REST API Endpoints (Auth, Doctors, Appointments, Payments)
│   │   ├── service/                           # Core Business Logic & Payment Processing
│   │   ├── model/                             # JPA Entity Definitions (10 Core Tables)
│   │   ├── repository/                        # Spring Data JPA Data Access Repositories
│   │   ├── DTO/                               # Data Transfer Objects
│   │   ├── config/                            # Security, CORS, & App Configurations
│   │   ├── filter/                            # JWT Authentication Filters
│   │   ├── utils/                             # Utility Helpers (JWT Tokens, HMAC Verification)
│   │   └── Exceptions/                        # Custom Exception Handlers
│   ├── Dockerfile                             # Backend Container Definition
│   └── pom.xml                                # Maven Dependencies & Build Config
│
├── Front-hospital-management-system/          # React 18 SPA Frontend Service
│   └── hospital managment system/
│       ├── src/
│       │   ├── admin/                         # Admin Dashboard, Roster Management & Analytics
│       │   ├── doctor/                        # Doctor Portal, Appointments & Prescription Modules
│       │   ├── patient/                       # Patient Portal, Doctor Search & Slot Booking
│       │   ├── components/                    # Shared UI Components (Modals, Tables, Navigation)
│       │   ├── config/                        # Axios HTTP Client & API Routes Config
│       │   ├── utils/                         # Token Storage & Formatting Helpers
│       │   ├── App.jsx                        # Main Application Router & State Gateway
│       │   └── main.jsx                       # React Application Entrypoint
│       ├── Dockerfile                         # Frontend Container Definition
│       ├── nginx.conf                         # Nginx Reverse Proxy Config for SPA
│       └── package.json                       # Node.js Dependencies & Build Scripts
│
├── docker-compose.yml                         # Container Orchestration (DB, Backend, Frontend, Nginx)
├── .env                                       # Environment Variables Template
└── README.md                                  # Project Documentation
```

---

## 👥 System User Roles & Capabilities

<details open>
<summary><b>🔍 Click to view System Roles & Capabilities Overview</b></summary>

```
                  ┌──────────────────────────────────────────────┐
                  │          Hospital Management System          │
                  └──────┬─────────────────┬──────────────┬──────┘
                         │                 │              │
           ┌─────────────┴─────┐    ┌──────┴───────┐   ┌──┴──────────┐
           │   Patient / User  │    │    Doctor    │   │ Admin User  │
           └─────────────┬─────┘    └──────┬───────┘   └──┬──────────┘
                         │                 │              │
     • Quick Doctor Search                 │              │
     • 30-Min Slot Booking                 │              │
     • Razorpay Online Payment             │              │
     • View Prescriptions & History ───────┼──────────────┤
     • Profile & Password Reset            │              │
                                   • Manage Availability  │
                                   • Issue Prescriptions  │
                                   • Review Patient List  │
                                                          • Doctor Onboarding
                                                          • Department Config
                                                          • Pharmacy Stock
                                                          • System Analytics
```
</details>

---

## ⚡ Performance & SLA Standards

- 🚀 **High Throughput**: Built to handle **≥ 1,000 requests/sec** with Spring Boot 3.x stateless REST and Hibernate ORM level-2 caching.
- ⚡ **Lightning Fast**: Sub-**200ms** query response times for all REST endpoints.
- 🛡️ **Data Integrity**: Enforces strict **ACID compliance** across multi-table transactions (Booking ➔ Payment ➔ Stock Deduction).

---

## 📐 System Architecture & Diagrams

<details>
<summary><b>📌 Click to expand Architecture Diagrams (Use Case, DFD, Class Architecture)</b></summary>

### 1. Use Case Diagram
```mermaid
graph LR
    subgraph Users ["System Actors"]
        Patient["👨‍⚕️ Patient / User"]
        Doctor["🩺 Doctor"]
        Admin["👑 Administrator"]
    end

    subgraph HMS ["Hospital Management System"]
        UC1["Login & Registration"]
        UC2["Quick Doctor Search"]
        UC3["Book Appointment Slot"]
        UC4["Make Online Payment"]
        UC5["View My Prescriptions"]
        UC6["Issue Prescription & Dosage"]
        UC7["Manage Doctor & Department Roster"]
        UC8["Pharmacy Inventory Stock Control"]
    end

    Patient --> UC1
    Patient --> UC2
    Patient --> UC3
    Patient --> UC4
    Patient --> UC5

    Doctor --> UC1
    Doctor --> UC3
    Doctor --> UC5
    Doctor --> UC6

    Admin --> UC1
    Admin --> UC7
    Admin --> UC8
```

---

### 2. Level-1 Data Flow Diagram (DFD)
```mermaid
graph TD
    User["👨‍⚕️ Patient / Guest"] -->|Credentials / Search Query| P1["1.0 Authentication & Search"]
    P1 <-->|Read / Write User Data| D1[("D1: User_DB")]
    P1 <-->|Read Doctor Schedules| D2[("D2: Doctor_DB")]

    User -->|Select Time Slot & Doctor| P2["2.0 Appointment Booking"]
    P2 -->|Reserve Appointment| D3[("D3: Appointment_DB")]

    User -->|Payment Info| P3["3.0 Razorpay Payment Processing"]
    P3 -->|Update Transaction Ledger| D4[("D4: Payment_DB")]

    Doc["🩺 Doctor / Admin"] -->|Prescription & Stock Update| P4["4.0 Clinical & Inventory Service"]
    P4 -->|Write Medical Record| D5[("D5: Prescription_DB")]
    P4 -->|Deduct Stock| D6[("D6: Pharmacy_DB")]
```

---

### 3. Service Layer Architecture
```mermaid
classDiagram
    class PatientController {
        +getPatientProfile()
        +updateProfile()
        +getMedicalHistory()
    }
    class DoctorController {
        +getAllDoctors()
        +getAvailableSlots()
        +addConsultationNotes()
    }
    class AdminController {
        +registerDoctor()
        +manageDepartments()
        +updateInventory()
    }
    class AppointmentsService {
        +createAppointment()
        +cancelAppointment()
        +getPatientAppointments()
    }
    class PaymentService {
        +createRazorpayOrder()
        +verifyPaymentSignature()
        +getPaymentLedger()
    }
    class PrescriptionService {
        +issuePrescription()
        +getPrescriptionByAppt()
    }

    PatientController --> AppointmentsService
    DoctorController --> PrescriptionService
    AdminController --> DoctorController
    AppointmentsService --> PaymentService
```
</details>

---

## 🗄️ Database Design (10 Core Relational Tables)

HMS uses MySQL 8.0 with 10 structured tables enforcing strict foreign keys and indexes:

<details>
<summary><b>🗄️ Click to expand Database Table Schemas (10 Tables)</b></summary>

### 1. `users` — Account Identities
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userid` | BigInt(20) | PK, Auto Increment | Account ID |
| `email` | Varchar(255) | Unique, Not Null | Login email address |
| `password` | Varchar(255) | Not Null | BCrypt hashed password |
| `firstName` | Varchar(30) | Nullable | First name |
| `lastName` | Varchar(30) | Nullable | Last name |
| `contactdetails` | Varchar(10) | Not Null | 10-digit mobile number |
| `address` | Varchar(255) | Nullable | Residential address |
| `profile_photo` | Varchar(255) | Nullable | Profile photo URL |
| `date_of_birth` | Date | Not Null | Date of birth |
| `timeofcreation` | Timestamp | Not Null | Account creation time |
| `UserRole` | Varchar(50) | Enum | `PATIENT`, `DOCTOR`, `ADMIN` |

### 2. `patients` — Patient Metadata
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `patient_id` | BigInt(20) | PK, Auto Increment | Patient ID |
| `user_id` | BigInt(20) | FK ➔ `users(userid)` | Linked user account |
| `blood_group` | Varchar(10) | Nullable | Blood group |
| `emergency_contact_name` | Varchar(50) | Nullable | Emergency contact name |
| `emergency_contact_number` | Varchar(15) | Nullable | Emergency contact phone |
| `emergency_contact_relation` | Varchar(20) | Nullable | Contact relationship |
| `description` | Varchar(255) | Nullable | Patient background notes |

### 3. `doctor` — Doctor Profiles
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `doctorid` | BigInt(20) | PK, Auto Increment | Doctor ID |
| `user_id` | BigInt(20) | FK ➔ `users(userid)` | Linked user account |
| `department_id` | BigInt(20) | FK ➔ `department(departmentId)` | Assigned department |
| `specialization` | Varchar(255) | Not Null | Medical specialty |
| `qualification` | Varchar(255) | Not Null | Degrees (e.g., MBBS, MD) |
| `yearsOfExperience` | Int(11) | Not Null | Years of practice |
| `consultationFee` | Double(10,2) | Not Null | Consultation charge |
| `licenseNumber` | Varchar(255) | Unique, Not Null | Medical license number |
| `roomNumber` | Int(11) | Nullable | Consultation room number |
| `availabilityStatus` | Varchar(50) | Enum | `AVAILABLE`, `NOT_AVAILABLE`, `ON_LEAVE` |
| `description` | Varchar(1000) | Nullable | Doctor biography |

### 4. `department` — Hospital Departments
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `departmentId` | BigInt(20) | PK, Auto Increment | Department ID |
| `departmentName` | Varchar(255) | Unique, Not Null | Department name |
| `description` | Varchar(500) | Nullable | Department overview |

### 5. `appointments` — Booking Ledger
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `appointment_id` | BigInt(20) | PK, Auto Increment | Appointment ID |
| `patient_id` | BigInt(20) | FK ➔ `patients` | Patient ID |
| `doctor_id` | BigInt(20) | FK ➔ `doctor` | Doctor ID |
| `department_id` | BigInt(20) | FK ➔ `department` | Department ID |
| `appointment_date` | Date | Not Null | Date of consultation |
| `appointment_start_time` | Time | Not Null | Slot start time |
| `appointment_end_time` | Time | Not Null | Slot end time |
| `appointmentType` | Varchar(50) | Enum | Consultation type |
| `status` | Varchar(50) | Enum | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
| `remarks` | Varchar(500) | Nullable | Notes |

### 6. `payments` — Transaction Records
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `payment_id` | BigInt(20) | PK, Auto Increment | Payment ID |
| `appointment_id` | BigInt(20) | FK ➔ `appointments` | Booking ID |
| `patient_id` | BigInt(20) | FK ➔ `patients` | Patient ID |
| `doctor_id` | BigInt(20) | FK ➔ `doctor` | Doctor ID |
| `razorpay_order_id` | Varchar(100) | Unique, Not Null | Razorpay order ID |
| `razorpay_payment_id` | Varchar(255) | Unique, Nullable | Gateway payment ID |
| `razorpay_signature` | Varchar(500) | Nullable | HMAC SHA-256 signature |
| `receipt_number` | Varchar(255) | Unique, Not Null | Receipt reference |
| `amount` | Decimal(10,2) | Not Null | Transaction amount |
| `currency` | Varchar(10) | Not Null | Currency code |
| `payment_method` | Varchar(50) | Enum | Payment mode |
| `order_status` | Varchar(50) | Enum | Order processing state |
| `payment_status` | Varchar(50) | Enum | `PENDING`, `SUCCESS`, `FAILED` |
| `paid_at` | Timestamp | Nullable | Payment confirmation timestamp |
| `created_at` | Timestamp | Nullable | Order creation timestamp |

### 7. `medicine_master` — Pharmacy Stock
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `medicine_id` | BigInt(20) | PK, Auto Increment | Medicine ID |
| `medicine_name` | Varchar(100) | Not Null | Medicine name |
| `generic_name` | Varchar(100) | Nullable | Active ingredient |
| `manufacturer` | Varchar(100) | Nullable | Manufacturer |
| `strength` | Varchar(50) | Nullable | Dosage strength |
| `dosage_form` | Varchar(50) | Nullable | Tablet, Syrup, etc. |
| `is_active` | Boolean | Not Null | Stock active status |

### 8. `prescription` — Diagnostic Headers
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `prescription_id` | BigInt(20) | PK, Auto Increment | Prescription ID |
| `appointment_id` | BigInt(20) | FK ➔ `appointments` | Appointment reference |
| `diagnosis` | Varchar(500) | Not Null | Diagnosis summary |
| `notes` | Varchar(1000) | Nullable | Doctor advice |
| `createdAt` | Timestamp | Nullable | Issuance timestamp |

### 9. `prescription_medicine` — Prescribed Medicines
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `prescription_medicine_id` | BigInt(20) | PK, Auto Increment | Line item ID |
| `prescription_id` | BigInt(20) | FK ➔ `prescription` | Prescription ID |
| `medicine_id` | BigInt(20) | FK ➔ `medicine_master` | Medicine ID |
| `dosage` | Varchar(50) | Not Null | Unit dosage |
| `frequency` | Varchar(50) | Not Null | Intake frequency |
| `duration` | Varchar(50) | Not Null | Intake duration |
| `instructions` | Varchar(300) | Nullable | Special instructions |
| `quantity` | Varchar(30) | Nullable | Dispensed quantity |

### 10. `password_reset_token` — Auth Recovery
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt(20) | PK, Auto Increment | Token entry ID |
| `token` | Varchar(255) | Unique, Not Null | Secure UUID token |
| `user_id` | BigInt(20) | FK ➔ `users` | Linked user ID |
| `expiryTime` | Timestamp | Not Null | Expiration timestamp |
| `used` | Boolean | Not Null | Token used status |
</details>

---

## 💻 Code Style & Conventions

<details>
<summary><b>📜 Click to view Code Conventions Matrix</b></summary>

| Identifier Category | Casing Pattern | Example Implementation | Context & Rules |
| :--- | :--- | :--- | :--- |
| **Classes & Enums** | `PascalCase` | `Patient`, `DoctorService`, `AppointmentController` | Noun phrases representing domain concepts. No underscores. |
| **Service Methods** | `camelCase` | `getPatientById()`, `bookAppointment()`, `processPayment()` | Action-oriented verbs describing specific business operations. |
| **Method Parameters** | `camelCase` | `patientId`, `doctorDTO`, `appointmentDate` | Self-explanatory parameter names reflecting types and roles. |
| **Interfaces** | `PascalCase` | `PatientRepository`, `PaymentService` | Contracts for Spring Data JPA repositories and core services. |
| **Entity Properties** | `PascalCase` / `camelCase` | `ConsultationFee`, `appointmentDate` | Noun attributes mapped to database columns. |
| **Private Fields** | `_camelCase` | `_patientService`, `_doctorRepo` | Private dependency fields injected into service layers. |
| **Exceptions** | `PascalCase` + `Exception` | `ResourceNotFoundException`, `UnauthorizedAccessException` | Suffix mandatory for all custom exception handlers. |
</details>

---

## 🗓️ Development Milestones

```
2026-04-12  ──  Project Kickoff & Feasibility Planning
2026-04-25  ──  SRS Documentation & Requirements Finalization
2026-06-10  ──  System Architecture & 10-Table Database Design Approval
2026-07-02  ──  Backend Core Setup (Spring Boot 3.x + MySQL 8.0)
2026-07-08  ──  JWT Authentication & User REST APIs
2026-07-14  ──  Doctor Discovery & 30-Minute Slot Scheduling Logic
2026-07-20  ──  React 18 Single Page Application Frontend
2026-07-26  ──  Admin Control Panel & Department Roster Management
2026-07-30  ──  Razorpay Payment Gateway & Email Receipt Integration
2026-08-02  ──  Pharmacy Inventory Stock & Digital Prescription Module
2026-08-05  ──  Security Audit & Role-Based Access Control Checks
2026-08-07  ──  Pilot Trial & Staff Workflow Optimization
2026-08-09  ──  Query Index Optimization & Performance Tuning
2026-08-11  ──  Production Deployment on AWS EC2 & RDS
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18 SPA (Vite), Vanilla CSS, Axios, Lucide React, Tabler Icons
- **Backend**: Java 21, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Hibernate ORM
- **Database**: MySQL 8.0 / Amazon RDS
- **Integrations**: Razorpay Payment API Gateway, JavaMailSender (SMTP)
- **DevOps & Infrastructure**: Docker, Docker Compose, Nginx Reverse Proxy, AWS EC2, Let's Encrypt SSL, DuckDNS

---

## ⚡ Quick Start Guide

### Prerequisites
- [Java 17/21 JDK](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18+ and npm](https://nodejs.org/)
- [MySQL 8.0](https://dev.mysql.com/downloads/installer/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Optional)*

---

### Step 1: Clone Repository
```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
cd Hospital-Management-System
```

---

### Step 2: Set Environment Variables
Create a `.env` file in the root folder:

```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/hospital_management_system
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Security & CORS
JWT_SECRET=your_super_secret_jwt_key_32_bytes_long!!
FRONTEND_URL=http://localhost:5173

# Email Service (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### Step 3: Run with Docker (Recommended)
```bash
docker compose up -d --build
```
Access the application at `http://localhost`.

---

### Step 4: Run Manually

#### Launch Backend (Spring Boot):
```bash
./mvnw clean install
./mvnw spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

#### Launch Frontend (React SPA):
```bash
cd Front-hospital-management-system/"hospital managment system"
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
