<h1 align="center">🏥 Hospital Management System (HMS)</h1>

<p align="center">
  <b>A Web-Based Healthcare Management Platform built as part of the Post Graduate Diploma in Advanced Computing (PG-DAC) at Sunbeam Institute of Information Technology, Pune.</b>
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org">
    <img src="https://img.shields.io/badge/Live_Demo-medicare--hospital.duckdns.org-0070f3?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <a href="USER_CREDENTIALS.md">
    <img src="https://img.shields.io/badge/Demo_Credentials-USER__CREDENTIALS.md-10B981?style=for-the-badge&logo=1password&logoColor=white" alt="Demo Credentials" />
  </a>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/AWS-EC2_%26_RDS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org"><b>🚀 Try Live Demo</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="USER_CREDENTIALS.md"><b>🔐 Test Account Credentials</b></a>
</p>

---

## 📌 Project Overview

This **Hospital Management System (HMS)** is a web application designed to handle core hospital operations: doctor discovery, consultation bookings, online payment verification, digital prescriptions, and pharmacy stock management.

The application supports three distinct user roles:
- **Patients**: Search for doctors by specialization, book consultation slots in 30-minute intervals, make online payments via Razorpay, and view past medical history and digital prescriptions.
- **Doctors**: Manage consultation availability status, review patient appointment requests, and issue digital prescriptions with custom dosage and instructions.
- **Administrators**: Manage clinical departments, doctor rosters, patient records, pharmacy inventory, and review transaction ledgers and system metrics.

---

## 🔑 Quick Demo Credentials

You can test the application live at **[medicare-hospital.duckdns.org](https://medicare-hospital.duckdns.org)** using any of the pre-configured test accounts below:

| Role | Username / Email | Default Password | Full Credentials Guide |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `admin123` | [🔐 Full Credentials List](USER_CREDENTIALS.md) |
| **Doctor (Newly Created)** | *(Any doctor email created by Admin)* | **`1234`** | [🔐 Full Credentials List](USER_CREDENTIALS.md) |
| **Doctor (Pre-seeded)** | `amit.patel@hospital.com` | `doctor123` | [🔐 Full Credentials List](USER_CREDENTIALS.md) |
| **Patient** | `aarav.sharma@gmail.com` | `patient123` | [🔐 Full Credentials List](USER_CREDENTIALS.md) |

---

## ✨ Core Functional Modules

### 🔍 1. Doctor Discovery & Quick Search
- Search doctors by **Department Name**, **Doctor Name**, or **Specialization** without needing to log in.
- Displays doctor qualifications, years of experience, room numbers, consultation fees, and active availability status (`AVAILABLE`, `ON_LEAVE`, `NOT_AVAILABLE`).

### 📅 2. Appointment Booking & Time Slot Allocation
- Select consultation time slots in **30-minute intervals** (between 09:00 AM and 05:00 PM).
- Automatic slot conflict validation to prevent double-booking.
- Real-time appointment sorting prioritizing recent bookings at the top.

### 💳 3. Razorpay Payment Gateway & Signature Verification
- Payment processing using Razorpay REST API order creation and HMAC signature verification.
- Updates appointment status from `PENDING` to `CONFIRMED` upon payment success.
- Generates payment receipts and sends confirmation emails via JavaMailSender.

### 💊 4. Digital Prescriptions & Pharmacy Stock Control
- Doctors issue digital prescriptions linked to specific appointment IDs.
- Includes diagnosis details, clinical notes, and medicine details (dosage, frequency, duration, instructions, quantity).
- Centralized `medicine_master` inventory tracking stock availability.

### 🔐 5. Security & Access Control
- Role-based authorization (`PATIENT`, `DOCTOR`, `ADMIN`) using Spring Security and JWT tokens.
- Password hashing with `BCryptPasswordEncoder`.
- Explicit CORS origin whitelisting (`setAllowedOrigins`) in `SecurityConfig.java` to secure cross-origin requests.

---

## 🗄️ Database Architecture (10 Relational Tables)

The backend uses MySQL 8.0 on Amazon RDS structured across 10 normalized relational tables:

```
├── users (userid, email, password, firstName, lastName, contactdetails, address, date_of_birth, userRole)
├── patients (patient_id, user_id, blood_group, emergency_contact_name, emergency_contact_number, relation)
├── doctor (doctorid, user_id, department_id, specialization, qualification, yearsOfExperience, consultationFee, roomNumber, availabilityStatus)
├── department (departmentId, departmentName, description)
├── appointments (appointment_id, patient_id, doctor_id, department_id, appointment_date, start_time, end_time, status)
├── payments (payment_id, appointment_id, patient_id, doctor_id, razorpay_order_id, razorpay_payment_id, amount, payment_status)
├── medicine_master (medicine_id, medicine_name, generic_name, manufacturer, strength, dosage_form, is_active)
├── prescription (prescription_id, appointment_id, diagnosis, notes, createdAt)
├── prescription_medicine (prescription_medicine_id, prescription_id, medicine_id, dosage, frequency, duration, instructions)
└── password_reset_token (id, token, user_id, expiryTime, used)
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS, Axios, Lucide Icons, Tabler Icons
- **Backend**: Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate ORM
- **Database**: MySQL 8.0 / Amazon RDS
- **Integrations**: Razorpay Payment API, JavaMailSender (SMTP)
- **DevOps & Cloud**: Docker, Docker Compose, Nginx Reverse Proxy, AWS EC2, Let's Encrypt SSL (Certbot), DuckDNS

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["📱 Web & Mobile Browsers<br>(https://medicare-hospital.duckdns.org)"] -->|HTTPS / Port 443| Nginx["⚡ Nginx Reverse Proxy Container"]
    Nginx -->|Serve Build| ReactApp["🎨 React Frontend Container"]
    Nginx -->|Proxy /api/| SpringBoot["🍃 Spring Boot Backend Container (Port 8080)"]
    SpringBoot -->|JPA/JDBC| RDS[("🗄️ Amazon RDS MySQL Database")]
    SpringBoot -->|REST API| Razorpay["💳 Razorpay Payment Gateway"]
    SpringBoot -->|SMTP Mail| Gmail["✉️ JavaMail Sender"]
```

---

## 🚀 Running the Project Locally

### Prerequisites
- JDK 21
- Node.js 18+ or 20+
- Docker & Docker Compose
- MySQL Server 8.0

### 1. Clone the Repository
```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DB_URL=jdbc:mysql://localhost:3306/hospital_management_system
DB_USERNAME=root
DB_PASSWORD=yourpassword
FRONTEND_URL=http://localhost:5173
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Build & Run via Docker Compose
```bash
docker compose up -d --build
```

The frontend will be available locally at `http://localhost`.

---

## 🎓 Academic Credit & Acknowledgement

This project was developed as part of the **Post Graduate Diploma in Advanced Computing (PG-DAC)** program at **Sunbeam Institute of Information Technology (SIIT), Pune**.

- **Author**: Utkarsh Pawade
- **Faculty Guide**: Prof. Neeti Chandrakar
- **Course Coordinators**: Mr. Nitin Kudale, Mr. Yogesh Kolhe
