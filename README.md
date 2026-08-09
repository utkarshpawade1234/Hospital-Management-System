<div align="center">

# 🏥 Hospital Management System

### A Secure, Role-Based Full Stack Hospital Management Platform

<p align="center">
Built using <b>Spring Boot • React • MySQL • JWT • Spring Security • Razorpay</b>
</p>

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-success?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Secured-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# 📖 About

Hospital Management System is a modern healthcare management platform that digitalizes hospital operations through secure role-based authentication.

The application provides dedicated dashboards for:

- 👨‍💼 Admin
- 👨‍⚕️ Doctor
- 🧑 Patient

allowing efficient management of appointments, prescriptions, payments, departments, medicines and patient records.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Login
- User Registration
- Forgot Password
- Password Reset using Email
- BCrypt Password Encryption

---

## 👨‍💼 Admin

✅ Dashboard

✅ Manage Doctors

✅ Manage Patients

✅ Manage Departments

✅ Manage Medicines

✅ Manage Appointments

✅ Update Appointment Status

✅ Search Doctors & Patients

---

## 👨‍⚕️ Doctor

- View Profile
- Update Profile
- Manage Availability
- View Assigned Appointments
- Confirm Appointment
- Complete Appointment
- Cancel Appointment
- Create Prescription
- Search Medicines

---

## 🧑 Patient

- Register Patient Profile
- View Profile
- Update Profile
- Search Doctor
- Book Appointment
- View Prescriptions
- Make Online Payment

---

## 💳 Payment

✔ Razorpay Integration

✔ Payment Verification

✔ Payment History

✔ Duplicate Payment Prevention

✔ Refund Support

---

## 💊 Medicine Management

- Add Medicine
- Update Medicine
- Activate / Deactivate Medicine
- Search Medicines

---

## 📧 Email Service

- Forgot Password
- Reset Password Link
- HTML Email Templates

---

# 🏗️ Tech Stack

| Backend | Frontend | Database | Security | Tools |
|----------|-----------|-----------|------------|--------|
| Java 21 | React | MySQL | Spring Security | Maven |
| Spring Boot | Vite | Hibernate | JWT | Swagger |
| Spring Data JPA | Axios | | BCrypt | Git |
| Java Mail | React Router | | | Razorpay |

---

# 🧩 Architecture

```text
                 +--------------------+
                 |      React UI      |
                 +---------+----------+
                           |
                     REST APIs
                           |
                 +---------v----------+
                 |   Spring Boot API  |
                 +---------+----------+
                           |
      --------------------------------------------
      |            |            |                 |
 Authentication  Appointment  Payment      Prescription
      |            |            |                 |
      --------------------------------------------
                           |
                 Spring Data JPA
                           |
                      MySQL Database
```

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| 👨‍💼 Admin | Full System Access |
| 👨‍⚕️ Doctor | Appointments, Prescriptions, Medicines |
| 🧑 Patient | Profile, Appointment, Payment |

---

# 📁 Project Structure

```text
Hospital-Management-System

├── Backend
│   ├── Controller
│   ├── Service
│   ├── Repository
│   ├── Entity
│   ├── DTO
│   ├── Config
│   ├── Security
│   └── Exception
│
├── Frontend
│   ├── Components
│   ├── Pages
│   ├── Services
│   ├── Context
│   └── Assets
```

---

# 🚀 Installation

## Clone

```bash
git clone https://github.com/utkarshpawade1234/Hospital-Management-System.git
```

Backend

```bash
cd Back-hospital-management-system

mvn clean install

mvn spring-boot:run
```

Frontend

```bash
cd Front-hospital-management-system

npm install

npm run dev
```

---

# ⚙ Configuration

Database

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
```

Mail

```properties
spring.mail.username=
spring.mail.password=
```

JWT

```properties
jwt.secret=
```

Razorpay

```properties
razorpay.key.id=
razorpay.key.secret=
```

---

# 🔒 Security

✔ JWT Authentication

✔ Role Based Authorization

✔ Spring Security

✔ BCrypt Password Encryption

✔ Method Level Security

---

# 📚 REST APIs

## Authentication

- Register
- Login
- Forgot Password
- Reset Password

## Admin

- Doctors
- Patients
- Departments
- Dashboard
- Medicines
- Appointments

## Doctor

- Profile
- Appointments
- Prescriptions
- Medicines

## Patient

- Profile
- Doctor Search
- Appointment
- Payment

---

# 📷 Screenshots

> Add your screenshots here

```
📁 screenshots/

login.png

dashboard.png

doctor.png

patient.png

payment.png
```

---

# 🛣 Future Enhancements

- 🤖 AI Medical Chatbot
- 📹 Video Consultation
- 📄 Medical Reports
- 📱 Mobile App
- ☁ Cloud Deployment
- 🐳 Docker
- ☸ Kubernetes
- 🔔 WhatsApp Notifications

---

# 👨‍💻 Developed By

## Utkarsh Pawade

Java Backend Developer

GitHub

https://github.com/utkarshpawade1234

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.

It helps a lot!

---

<div align="center">

## ❤️ Thank You For Visiting

Happy Coding 🚀

</div>
