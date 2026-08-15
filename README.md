<h1 align="center">🏥 Medicare - Hospital Management System</h1>

<p align="center">
  <b>A Modern, Production-Grade Full-Stack Healthcare Management Platform</b>
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-medicare--hospital.duckdns.org-0070f3?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <a href="USER_CREDENTIALS.md">
    <img src="https://img.shields.io/badge/🔑_Demo_Credentials-USER__CREDENTIALS.md-10B981?style=for-the-badge&logo=1password&logoColor=white" alt="Demo Credentials" />
  </a>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/AWS-EC2_%26_RDS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
</p>

<p align="center">
  <a href="https://medicare-hospital.duckdns.org"><b>🚀 Click Here to Visit Live Application</b></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="USER_CREDENTIALS.md"><b>🔐 View All Test User Credentials</b></a>
</p>

---

## 🌟 Overview

**Medicare** is a full-stack healthcare web platform built to automate patient registrations, doctor consultations, appointment scheduling, online payment verification, and real-time email notifications.

Designed with **Spring Boot 3** on the backend and **React 18** on the frontend, Medicare is containerized using **Docker Compose** and deployed live on **AWS EC2 & RDS** with Nginx reverse proxying and automated Let's Encrypt SSL encryption.

---

## 🔑 Quick Login Credentials

To quickly test the live demo, click on **[USER_CREDENTIALS.md](USER_CREDENTIALS.md)** or use the quick accounts below:

| Role | Username / Email | Default Password | Link |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@hospital.com` | `admin123` | [🔐 Full Guide](USER_CREDENTIALS.md) |
| **🩺 Newly Created Doctor** | *(Any new email created by Admin)* | **`1234`** | [🔐 Full Guide](USER_CREDENTIALS.md) |
| **🩺 Pre-seeded Doctor** | `amit.patel@hospital.com` | `doctor123` | [🔐 Full Guide](USER_CREDENTIALS.md) |
| **👨‍⚕️ Patient** | `aarav.sharma@gmail.com` | `patient123` | [🔐 Full Guide](USER_CREDENTIALS.md) |

---

## ⚡ Key Features

| Portal | Feature Capabilities |
| :--- | :--- |
| **👨‍⚕️ Patient Dashboard** | JWT Registration/Login, Doctor Search by Specialization, Real-time Appointment Slot Selection, Payment Checkout |
| **💳 Online Payments** | **Razorpay Gateway** integration with server-side payment verification & instant status confirmation |
| **📩 Email Alerts** | Automated booking confirmation & payment receipt emails powered by Spring Boot Mail Service |
| **🩺 Doctor Portal** | Schedule Management, Patient Appointment Approvals, Consultation Tracking |
| **🔐 Admin Operations** | System Analytics, User & Doctor Registration Control |
| **🛡️ Infrastructure** | Nginx Reverse Proxy, CORS Whitelisting, Free HTTPS via Let's Encrypt SSL, Dockerized Containers |

---

## 🛠️ Technology Stack

```
 Frontend     : React 18 • Vite • Axios • Vanilla CSS • Lucide Icons
 Backend      : Java 21 • Spring Boot 3 • Spring Security (JWT) • Spring Data JPA
 Database     : MySQL 8.0 • Amazon RDS
 Payments     : Razorpay Gateway REST API
 Cloud/DevOps : AWS EC2 • Docker & Docker Compose • Nginx • Let's Encrypt (Certbot)
```

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

## 🚀 Quick Deployment & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2. Environment Configuration
Create a `.env` file in the project root:
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

### 3. Launch with Docker Compose
```bash
docker compose up -d --build
```

---

<p align="center">
  Developed by <b>Utkarsh Pawade</b> • <a href="https://medicare-hospital.duckdns.org">Visit Live Project</a> • <a href="USER_CREDENTIALS.md">Credentials Guide</a>
</p>
