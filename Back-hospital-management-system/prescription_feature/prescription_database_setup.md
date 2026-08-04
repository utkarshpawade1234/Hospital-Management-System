# Database Setup Guide - Prescription Module

This guide details how to create and configure the database tables required for the Prescription module.

---

## Method 1: Automatic Table Creation (Recommended)

Spring Boot and Hibernate can automatically generate or update the database schema when you run the application.

1. Open your `application.properties` file (located in `src/main/resources/application.properties`).
2. Add or update the following configuration line:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Restart your Spring Boot application. Hibernate will detect the new `@Entity` classes and create/update the tables automatically in your connected database.

---

## Method 2: Manual SQL Script (MySQL)

If you prefer to create the tables manually in your database (e.g., MySQL), execute the following SQL DDL script:

```sql
-- 1. Create 'prescription' table
CREATE TABLE IF NOT EXISTS `prescription` (
  `prescription_id` BIGINT NOT NULL AUTO_INCREMENT,
  `appointment_id` BIGINT NOT NULL UNIQUE,
  `diagnosis` VARCHAR(500) NOT NULL,
  `notes` VARCHAR(1000) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescription_id`),
  CONSTRAINT `fk_prescription_appointment` FOREIGN KEY (`appointment_id`) 
    REFERENCES `appointment` (`appointment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2. Create 'prescription_medicine' table
CREATE TABLE IF NOT EXISTS `prescription_medicine` (
  `prescription_medicine_id` BIGINT NOT NULL AUTO_INCREMENT,
  `prescription_id` BIGINT NOT NULL,
  `medicine_id` BIGINT NOT NULL,
  `dosage` VARCHAR(50) NOT NULL,
  `frequency` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `instructions` VARCHAR(255) DEFAULT NULL,
  `quantity` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`prescription_medicine_id`),
  CONSTRAINT `fk_pm_prescription` FOREIGN KEY (`prescription_id`) 
    REFERENCES `prescription` (`prescription_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_medicine` FOREIGN KEY (`medicine_id`) 
    REFERENCES `medicine_master` (`medicine_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

---

## Method 3: Sample Data (INSERT Statements)

To populate your catalog with active medicines and create a sample prescription, execute the following SQL script:

```sql
-- 1. Insert sample active medicines into 'medicine_master'
INSERT INTO `medicine_master` (`medicine_name`, `generic_name`, `manufacturer`, `strength`, `dosage_form`, `is_active`) VALUES
('Tylenol 500mg', 'Paracetamol', 'McNeil Consumer Healthcare', '500mg', 'Tablet', 1),
('Amoxil 250mg', 'Amoxicillin', 'GlaxoSmithKline', '250mg', 'Capsule', 1),
('Advil 200mg', 'Ibuprofen', 'Pfizer', '200mg', 'Tablet', 1),
('Glucophage 850mg', 'Metformin Hydrochloride', 'Bristol-Myers Squibb', '850mg', 'Tablet', 1),
('Lipitor 10mg', 'Atorvastatin Calcium', 'Pfizer', '10mg', 'Tablet', 1),
('Prilosec 20mg', 'Omeprazole', 'Procter & Gamble', '20mg', 'Capsule', 1),
('Zithromax 250mg', 'Azithromycin', 'Pfizer', '250mg', 'Tablet', 1),
('Ventolin HFA', 'Albuterol Sulfate', 'GlaxoSmithKline', '90mcg', 'Inhaler', 1);

-- 2. Insert sample prescription (Linked to an existing appointment, e.g. ID 23)
-- Make sure appointment_id exists in your 'appointment' table first.
INSERT INTO `prescription` (`appointment_id`, `diagnosis`, `notes`) VALUES
(23, 'Acute bacterial sinusitis and fever', 'Patient should rest, drink plenty of fluids, and complete the full course of antibiotics.');

-- 3. Link prescribed medicines to the created prescription (Assume prescription_id = 1, medicine_id = 1 and 2)
INSERT INTO `prescription_medicine` (`prescription_id`, `medicine_id`, `dosage`, `frequency`, `duration`, `instructions`, `quantity`) VALUES
(1, 1, '1 tablet', 'Every 8 hours as needed', '5 days', 'Take after meals for fever/pain relief', '15 tablets'),
(1, 2, '1 capsule', 'Twice daily', '7 days', 'Take at start of meal, complete full course', '14 capsules');
```

---

## Table Relationships Diagram

* **Appointment (1) ─── (1) Prescription**: An appointment has at most one prescription.
* **Prescription (1) ─── (N) PrescriptionMedicine**: A prescription contains list of prescribed medicines.
* **MedicineMaster (1) ─── (N) PrescriptionMedicine**: Each item in the prescription references a master medicine from the hospital catalog.
