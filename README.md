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
  <a href="USER_CREDENTIALS.md" target="_blank" rel="noopener noreferrer"><b>🔑 Test Accounts</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="utkarshhsmreport.pdf" target="_blank" rel="noopener noreferrer"><b>📄 View System Report (PDF)</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-getting-started"><b>⚡ Getting Started</b></a>
</p>

---

## 👋 About The Project

Managing hospital workflows manually often leads to scheduling overlaps, delayed patient care, lost health records, and billing friction. 

The **Hospital Management System (HMS)** addresses these challenges by replacing paper-based records with an automated digital platform. It brings patients, doctors, and hospital administrators together under a single, unified system—enabling conflict-free doctor bookings in 30-minute slots, automated Razorpay online payments, digital prescriptions, and real-time pharmacy inventory tracking.

---

## 🌟 Core Features

- ⏱️ **Conflict-Free Appointment Scheduling**: Smart slot reservation logic validates availability in 30-minute intervals between 09:00 AM and 05:00 PM to eliminate physician double-booking.
- 💳 **Seamless Payment Checkout**: Integrated Razorpay gateway featuring HMAC SHA-256 signature verification and automated confirmation receipts via email.
- 📋 **Digital Prescriptions & Medical Logs**: Doctors attach clinical diagnoses, dosages, frequencies, and special instructions directly to patient consultation histories.
- 💊 **Real-Time Pharmacy Control**: Automatic stock tracking and inventory updates triggered upon digital prescription issuance.
- 🔍 **Public Doctor & Department Discovery**: Guest visitors can browse available medical specialists, consultation charges, and OPD room numbers without logging in.

---

## 🖼️ Application Overview & Screenshots

### 1. Public Landing Page & Specialist Search
Visitors can discover specialists across Cardiology, Neurology, Pediatrics, Orthopedics, and Dermatology:
![Landing Page](docs_images/landing_page.png)

---

### 2. Patient Portal & Booking Overview
Registered patients can view upcoming consultations, payment statuses, and digital prescriptions:
![Patient Dashboard](docs_images/patient_dashboard.png)

---

### 3. Administrator Control Panel
Hospital administrators manage doctor rosters, department assignments, and pharmacy stock:
![Admin Control Panel](docs_images/admin_dashboard.png)

---

### 4. User Authentication & Registration
<p align="center">
  <img src="docs_images/login_page.png" width="48%" alt="Login Page" />
  &nbsp;
  <img src="docs_images/register_page.png" width="48%" alt="Registration Page" />
</p>

---

## 📐 System Architecture & Diagrams

### 1. Use Case Diagram
Visualizes interactions between Patients, Doctors, and Administrators within HMS:
![Use Case Diagram](docs_images/diagram_usecase.png)

---

### 2. Level-1 Data Flow Diagram (DFD)
Illustrates how data flows across authentication, scheduling, payment processing, and pharmacy services:
![Data Flow Diagram](docs_images/diagram_dfd.png)

---

### 3. System Class Diagram Architecture
Service layer structure connecting REST controllers, JPA repositories, and domain models:
![Class Diagram Architecture](docs_images/diagram_class.png)

---

### 4. Entity Relationship Diagram (10 Relational Tables)
MySQL 8.0 relational schema enforcing foreign keys and indexing:
![Entity Relationship Diagram](docs_images/diagram_er.png)

---

## 🗄️ Relational Database Schema Overview

HMS uses MySQL 8.0 hosted on Amazon RDS with 10 core relational tables:

| Table Name | Primary Key | Key Foreign Keys | Primary Function |
| :--- | :--- | :--- | :--- |
| **`users`** | `userid` | None | Stores user credentials, email, password hash, and role (`PATIENT`, `DOCTOR`, `ADMIN`) |
| **`patients`** | `patient_id` | `user_id` ➔ `users` | Contains patient medical background, blood group, and emergency contact details |
| **`doctor`** | `doctorid` | `user_id` ➔ `users`, `department_id` ➔ `department` | Doctor profile, specialization, fee, room number, and availability status |
| **`department`** | `departmentId` | None | Clinical departments (Cardiology, Neurology, Pediatrics, Orthopedics, etc.) |
| **`appointments`** | `appointment_id` | `patient_id`, `doctor_id`, `department_id` | Scheduled consultation date, 30-min start/end times, and booking status |
| **`payments`** | `payment_id` | `appointment_id`, `patient_id`, `doctor_id` | Razorpay order ID, payment transaction ID, HMAC signature, and order status |
| **`medicine_master`** | `medicine_id` | None | Central pharmacy inventory tracking medicine name, manufacturer, and active stock |
| **`prescription`** | `prescription_id` | `appointment_id` ➔ `appointments` | Clinical diagnosis summary and practitioner advice |
| **`prescription_medicine`** | `prescription_medicine_id` | `prescription_id`, `medicine_id` | Prescribed line items, unit dosage, frequency, and course duration |
| **`password_reset_token`** | `id` | `user_id` ➔ `users` | Secure random UUID tokens for email password recovery |

---

## 🛠️ Technology Stack

- **Frontend**: React 18 SPA (built with Vite), Vanilla CSS, Axios, Lucide Icons, Tabler Icons
- **Backend**: Java 21, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Hibernate ORM
- **Database**: MySQL 8.0 / Amazon RDS
- **Integrations**: Razorpay Payment REST Gateway, JavaMailSender (SMTP)
- **DevOps & Cloud**: Docker, Docker Compose, Nginx Reverse Proxy, AWS EC2, Let's Encrypt SSL, DuckDNS

---

## ⚡ Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- [Java 17 or 21 JDK](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18+ and npm](https://nodejs.org/)
- [MySQL 8.0](https://dev.mysql.com/downloads/installer/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Optional for containerized run)*

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
cd Hospital-Management-System
```

---

### Step 2: Configure Environment Variables
Create a `.env` file in the project root folder:

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

### Step 3: Launch with Docker Compose (Recommended)
```bash
docker compose up -d --build
```
Access the application in your browser at `http://localhost`.

---

### Step 4: Run Manually (Alternative)

#### Launch Spring Boot Backend:
```bash
./mvnw clean install
./mvnw spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

#### Launch React Frontend:
```bash
cd Front-hospital-management-system/"hospital managment system"
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
