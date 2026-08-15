<h1 align="center">🏥 Hospital Management System (HMS)</h1>

<p align="center">
  <b>A modern healthcare platform designed for streamlined patient care, doctor scheduling, and hospital administration.</b>
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-medicare--hospital.duckdns.org-0070f3?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/AWS-EC2_%26_RDS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org" target="_blank" rel="noopener noreferrer"><b>🚀 Launch Application</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="USER_CREDENTIALS.md" target="_blank" rel="noopener noreferrer"><b>🔑 Test Credentials</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="utkarshhsmreport.pdf" target="_blank" rel="noopener noreferrer"><b>📄 View System Report (PDF)</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-quick-start-guide"><b>⚡ Quick Start</b></a>
</p>

---

## 👋 Welcome to HMS

The **Hospital Management System (HMS)** is an intuitive, web-based platform built to eliminate paper-based administrative friction in medical facilities. It connects patients, medical practitioners, and hospital administrators under one unified, secure platform.

Whether it's a patient searching for a specialist, a doctor writing digital consultation notes, or an administrator tracking pharmacy stock, HMS makes the experience fast, transparent, and hassle-free.

---

## 🌟 Key Features at a Glance

| Feature | Description | How It Works |
| :--- | :--- | :--- |
| ⏱️ **30-Min Slot Booking** | Prevents schedule double-bookings | Real-time availability checks between 09:00 AM & 05:00 PM |
| 💳 **Razorpay Online Payment** | Instant fee checkout with confirmation | Gateway integration with HMAC SHA-256 signature validation & receipts |
| 📋 **Digital Prescriptions** | Electronic health record issuance | Doctors attach diagnoses, dosages, and instructions to booking IDs |
| 💊 **Pharmacy Inventory** | Real-time stock management | Automatic stock decrementing tied directly to prescription issuance |
| 🔍 **Guest Doctor Search** | Public specialist directory | Browse doctors by specialty, consultation fee, or room without logging in |

---

## 🖼️ Visual Application Tour

<details open>
<summary><b>✨ Click to expand Visual UI Tour & Screenshots</b></summary>

<br/>

### 1. Landing Page & Quick Specialist Search
![Landing Page](docs_images/landing_page.png)

---

### 2. Patient Portal Dashboard
![Patient Dashboard](docs_images/patient_dashboard.png)

---

### 3. Administrator Control Panel
![Admin Dashboard](docs_images/admin_dashboard.png)

---

### 4. Authentication & Registration
<p align="center">
  <img src="docs_images/login_page.png" width="48%" alt="Login Screen" />
  &nbsp;
  <img src="docs_images/register_page.png" width="48%" alt="Register Screen" />
</p>

</details>

---

## 📖 Interactive Documentation Hub

Click on any tab below to inspect detailed system architectures, database schemas, and codebase layouts:

<details>
<summary><b>📁 1. Project Directory & Architecture</b></summary>

HMS follows a clean, decoupled monorepo architecture separating the Spring Boot 3.x backend REST API service and the React 18 SPA frontend:

```
Hospital-Management-System/
├── Back-hospital-management-system/          # Spring Boot 3.x Backend Service
│   ├── src/main/java/com/hospital/hospital_management_system/
│   │   ├── RestController/                    # REST API Controllers (Auth, Doctor, Appts, Payment)
│   │   ├── service/                           # Core Business Services & Integrations
│   │   ├── model/                             # JPA Entity Definitions (10 Core Tables)
│   │   ├── repository/                        # Spring Data JPA Repositories
│   │   ├── DTO/                               # Data Transfer Objects
│   │   ├── config/                            # Security, CORS, & Mail Configuration
│   │   ├── filter/                            # JWT Security Filters
│   │   ├── utils/                             # Token & Verification Utilities
│   │   └── Exceptions/                        # Custom Global Exception Handlers
│   ├── Dockerfile                             # Backend Container Definition
│   └── pom.xml                                # Maven Dependencies
│
├── Front-hospital-management-system/          # React 18 SPA Frontend Service
│   └── hospital managment system/
│       ├── src/
│       │   ├── admin/                         # Admin Dashboard & Roster Views
│       │   ├── doctor/                        # Doctor Portal & Prescription Issuance
│       │   ├── patient/                       # Patient Portal, Doctor Search & Booking
│       │   ├── components/                    # Reusable UI Components & Modals
│       │   ├── config/                        # Axios Interceptors & Endpoint Config
│       │   ├── utils/                         # Token Management
│       │   ├── App.jsx                        # Main Application Gateway
│       │   └── main.jsx                       # React DOM Entrypoint
│       ├── Dockerfile                         # Frontend Container Definition
│       ├── nginx.conf                         # Nginx Reverse Proxy Config
│       └── package.json                       # Dependencies & Build Scripts
│
├── docs_images/                               # Diagrams & Screenshots
├── docker-compose.yml                         # Container Orchestration
├── utkarshhsmreport.pdf                       # Full Architectural PDF Report
└── README.md                                  # Repository Documentation
```
</details>

<details>
<summary><b>📐 2. Visual Architecture & Flow Diagrams</b></summary>

### Use Case Diagram
![Use Case Diagram](docs_images/diagram_usecase.png)

---

### Level-1 Data Flow Diagram (DFD)
![Data Flow Diagram](docs_images/diagram_dfd.png)

---

### System Class Diagram Architecture
![Class Diagram Architecture](docs_images/diagram_class.png)

---

### Entity Relationship Diagram (10 Relational Tables)
![Entity Relationship Diagram](docs_images/diagram_er.png)
</details>

<details>
<summary><b>🗄️ 3. Database Schema Overview (10 Tables)</b></summary>

The persistence layer uses MySQL 8.0 with 10 relational tables enforcing strict foreign keys and indexed query paths:

| Table Name | Primary Key | Key Foreign Keys | Purpose / Content |
| :--- | :--- | :--- | :--- |
| **`users`** | `userid` | None | Primary account store, email, password hash, role (`PATIENT`, `DOCTOR`, `ADMIN`) |
| **`patients`** | `patient_id` | `user_id` ➔ `users` | Medical history, blood group, emergency contact details |
| **`doctor`** | `doctorid` | `user_id` ➔ `users`, `department_id` ➔ `department` | Specialization, qualification, fee, room number, availability status |
| **`department`** | `departmentId` | None | Clinical departments (Cardiology, Neurology, Pediatrics, etc.) |
| **`appointments`** | `appointment_id` | `patient_id`, `doctor_id`, `department_id` | Scheduled date, 30-min start/end times, appointment status |
| **`payments`** | `payment_id` | `appointment_id`, `patient_id`, `doctor_id` | Razorpay order ID, payment transaction ID, HMAC signature, amount |
| **`medicine_master`** | `medicine_id` | None | Pharmacy stock inventory, generic name, manufacturer, dosage form |
| **`prescription`** | `prescription_id` | `appointment_id` ➔ `appointments` | Clinical diagnosis summary and doctor advice |
| **`prescription_medicine`** | `prescription_medicine_id` | `prescription_id`, `medicine_id` | Prescribed medicine line items, unit dosage, frequency, duration |
| **`password_reset_token`** | `id` | `user_id` ➔ `users` | Secure UUID tokens for email password recovery |

</details>

<details>
<summary><b>💻 4. Code Standards & Conventions</b></summary>

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

<details>
<summary><b>🗓️ 5. Development Milestones</b></summary>

```
2026-04-12  ──  Project Kickoff & Requirements Gathering
2026-04-25  ──  SRS Documentation & Scope Finalization
2026-06-10  ──  System Architecture & 10-Table Database Design Approval
2026-07-02  ──  Backend Core Infrastructure Setup (Spring Boot 3.x + MySQL 8.0)
2026-07-08  ──  JWT Authentication & User Account REST APIs
2026-07-14  ──  Doctor Discovery & 30-Minute Slot Scheduling Logic
2026-07-20  ──  React 18 Single Page Application Frontend
2026-07-26  ──  Admin Control Panel & Department Roster Management
2026-07-30  ──  Razorpay Payment Gateway & Transaction Email Receipts
2026-08-02  ──  Pharmacy Inventory Stock & Digital Prescription Module
2026-08-05  ──  Security Audit & Role-Based Access Control Checks
2026-08-07  ──  Pilot Trial & Staff Workflow Optimization
2026-08-09  ──  Query Index Optimization & Performance Tuning
2026-08-11  ──  Production Deployment on AWS EC2 & RDS
```

</details>

---

## ⚡ Quick Start Guide

### Prerequisites
- [Java 17 or 21 JDK](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18+ and npm](https://nodejs.org/)
- [MySQL 8.0 Server](https://dev.mysql.com/downloads/installer/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Optional for containerized run)*

---

### Step 1: Clone Repository
```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
cd Hospital-Management-System
```

---

### Step 2: Set Environment Variables
Create a `.env` file in the root directory:

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
Access the application in your browser at `http://localhost`.

---

### Step 4: Run Manually (Alternative)

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
