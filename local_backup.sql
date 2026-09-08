-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_management_system
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'f5f7a216-1a58-11f1-88a3-6867cdcd9daa:1-879';

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` bigint NOT NULL AUTO_INCREMENT,
  `appointment_date` date NOT NULL,
  `appointment_type` enum('CONSULTATION','FOLLOW_UP') NOT NULL,
  `appointment_end_time` time(6) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `appointment_start_time` time(6) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING') NOT NULL,
  `department_id` bigint NOT NULL,
  `doctor_id` bigint DEFAULT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `FK4ahttcgngxk3n7qwoupktdf05` (`department_id`),
  KEY `FKgpgce3qtc5fajyl4j5srcjkcf` (`doctor_id`),
  KEY `FK8exap5wmg8kmb1g1rx3by21yt` (`patient_id`),
  CONSTRAINT `FK4ahttcgngxk3n7qwoupktdf05` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `FK8exap5wmg8kmb1g1rx3by21yt` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  CONSTRAINT `FKgpgce3qtc5fajyl4j5srcjkcf` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctorid`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'2026-07-21','FOLLOW_UP','13:00:00.000000','Dermatology skin rash review','12:30:00.000000','COMPLETED',8,15,3),(2,'2026-07-20','CONSULTATION','09:30:00.000000','Dermatology skin rash review','09:00:00.000000','COMPLETED',1,NULL,10),(3,'2026-07-12','FOLLOW_UP','17:00:00.000000','Follow-up consultation','16:30:00.000000','CANCELLED',8,16,4),(4,'2026-07-13','FOLLOW_UP','15:30:00.000000','Routine checkup','15:00:00.000000','CONFIRMED',8,16,16),(5,'2026-07-08','CONSULTATION','13:00:00.000000','Routine checkup','12:30:00.000000','CANCELLED',8,16,7),(6,'2026-07-16','FOLLOW_UP','12:30:00.000000','Chronic back pain consultation','12:00:00.000000','CONFIRMED',2,4,2),(7,'2026-07-19','CONSULTATION','16:00:00.000000','Eye examination','15:30:00.000000','CANCELLED',9,17,12),(8,'2026-07-20','CONSULTATION','11:00:00.000000','Eye examination','10:30:00.000000','COMPLETED',2,3,11),(9,'2026-07-15','FOLLOW_UP','17:00:00.000000','Annual physical checkup','16:30:00.000000','CANCELLED',1,NULL,14),(10,'2026-07-17','FOLLOW_UP','11:00:00.000000','Experiencing mild headache','10:30:00.000000','COMPLETED',8,15,14),(11,'2026-07-18','CONSULTATION','13:00:00.000000','Experiencing mild headache','12:30:00.000000','CONFIRMED',5,9,4),(12,'2026-07-15','CONSULTATION','16:00:00.000000','Eye examination','15:30:00.000000','COMPLETED',2,3,14),(13,'2026-07-16','FOLLOW_UP','16:00:00.000000','Dermatology skin rash review','15:30:00.000000','CONFIRMED',8,16,7),(14,'2026-07-09','CONSULTATION','15:30:00.000000','Follow-up consultation','15:00:00.000000','COMPLETED',1,NULL,12),(15,'2026-07-10','CONSULTATION','13:00:00.000000','Dermatology skin rash review','12:30:00.000000','COMPLETED',8,16,3),(16,'2026-07-09','CONSULTATION','09:30:00.000000','Post-op follow up','09:00:00.000000','CANCELLED',5,9,7),(17,'2026-07-11','FOLLOW_UP','16:30:00.000000','Chronic back pain consultation','16:00:00.000000','CONFIRMED',9,17,1),(18,'2026-07-19','CONSULTATION','13:00:00.000000','Annual physical checkup','12:30:00.000000','PENDING',1,NULL,14),(19,'2026-07-18','CONSULTATION','12:30:00.000000','Annual physical checkup','12:00:00.000000','CONFIRMED',9,17,7),(20,'2026-07-10','CONSULTATION','12:30:00.000000','Experiencing mild headache','12:00:00.000000','CANCELLED',3,6,17),(21,'2026-07-21','CONSULTATION','15:30:00.000000','Routine checkup','15:00:00.000000','CANCELLED',5,10,20),(22,'2026-07-13','FOLLOW_UP','11:30:00.000000','Chronic back pain consultation','11:00:00.000000','COMPLETED',2,3,17),(23,'2026-07-10','CONSULTATION','17:00:00.000000','ENT throat irritation','16:30:00.000000','COMPLETED',2,3,5),(24,'2026-07-09','FOLLOW_UP','09:30:00.000000','Chronic back pain consultation','09:00:00.000000','CONFIRMED',9,17,3),(25,'2026-07-10','FOLLOW_UP','16:00:00.000000','Dermatology skin rash review','15:30:00.000000','CONFIRMED',9,17,3),(26,'2026-07-08','FOLLOW_UP','09:30:00.000000','Dermatology skin rash review','09:00:00.000000','COMPLETED',2,3,11),(27,'2026-07-11','CONSULTATION','09:30:00.000000','Dermatology skin rash review','09:00:00.000000','CONFIRMED',1,NULL,10),(28,'2026-07-14','CONSULTATION','14:30:00.000000','Experiencing mild headache','14:00:00.000000','CONFIRMED',9,17,4),(29,'2026-07-13','CONSULTATION','12:00:00.000000','Post-op follow up','11:30:00.000000','CONFIRMED',8,15,13),(30,'2026-07-13','CONSULTATION','11:30:00.000000','Experiencing mild headache','11:00:00.000000','COMPLETED',7,14,17),(31,'2026-07-19','FOLLOW_UP','11:00:00.000000','Anxiety and stress management session','10:30:00.000000','COMPLETED',5,9,15),(32,'2026-07-07','FOLLOW_UP','16:30:00.000000','Experiencing mild headache','16:00:00.000000','COMPLETED',2,4,3),(33,'2026-07-18','CONSULTATION','10:00:00.000000','Post-op follow up','09:30:00.000000','CANCELLED',8,16,13),(34,'2026-07-21','CONSULTATION','15:00:00.000000','ENT throat irritation','14:30:00.000000','COMPLETED',2,3,6),(35,'2026-07-18','FOLLOW_UP','10:00:00.000000','Dermatology skin rash review','09:30:00.000000','PENDING',5,9,15),(36,'2026-07-11','CONSULTATION','14:30:00.000000','Chronic back pain consultation','14:00:00.000000','CANCELLED',8,16,8),(37,'2026-07-13','FOLLOW_UP','14:30:00.000000','Chronic back pain consultation','14:00:00.000000','PENDING',6,11,10),(38,'2026-07-12','CONSULTATION','09:30:00.000000','Follow-up consultation','09:00:00.000000','COMPLETED',2,3,7),(39,'2026-07-12','CONSULTATION','15:30:00.000000','Chronic back pain consultation','15:00:00.000000','COMPLETED',2,3,17),(40,'2026-07-07','CONSULTATION','11:00:00.000000','Anxiety and stress management session','10:30:00.000000','CONFIRMED',8,16,9),(41,'2026-07-09','CONSULTATION','14:30:00.000000','Dermatology skin rash review','14:00:00.000000','CONFIRMED',3,5,16),(42,'2026-07-17','CONSULTATION','11:00:00.000000','Experiencing mild headache','10:30:00.000000','CONFIRMED',3,5,6),(43,'2026-07-11','FOLLOW_UP','16:30:00.000000','Routine checkup','16:00:00.000000','PENDING',3,5,7),(44,'2026-07-08','FOLLOW_UP','15:00:00.000000','ENT throat irritation','14:30:00.000000','COMPLETED',2,3,9),(45,'2026-07-19','CONSULTATION','10:00:00.000000','Routine checkup','09:30:00.000000','COMPLETED',2,3,16),(46,'2026-07-10','CONSULTATION','14:30:00.000000','Dermatology skin rash review','14:00:00.000000','CANCELLED',6,11,20),(47,'2026-07-13','FOLLOW_UP','09:30:00.000000','Chronic back pain consultation','09:00:00.000000','COMPLETED',1,NULL,1),(48,'2026-07-21','CONSULTATION','14:30:00.000000','Routine checkup','14:00:00.000000','COMPLETED',10,19,17),(49,'2026-07-12','CONSULTATION','12:30:00.000000','Eye examination','12:00:00.000000','CONFIRMED',9,17,1),(50,'2026-07-19','CONSULTATION','14:30:00.000000','Annual physical checkup','14:00:00.000000','COMPLETED',10,19,19),(52,'2026-07-07','CONSULTATION','10:30:00.000000','Routine Checkup','10:00:00.000000','PENDING',1,NULL,22),(54,'2026-07-22','CONSULTATION','00:25:00.000000','23','23:55:00.000000','PENDING',9,17,22),(55,'2026-07-24','CONSULTATION','00:27:00.000000','wqe','23:57:00.000000','PENDING',1,NULL,22),(57,'2026-08-07','CONSULTATION','15:30:00.000000','dfsadf','15:00:00.000000','PENDING',8,15,23),(58,'2026-08-08','CONSULTATION','15:00:00.000000','','14:30:00.000000','COMPLETED',2,3,24),(59,'2026-08-14','CONSULTATION','15:30:00.000000','wrrr','15:00:00.000000','CANCELLED',1,4,21),(60,'2026-08-19','CONSULTATION','16:30:00.000000','HH','16:00:00.000000','COMPLETED',1,3,21),(61,'2026-08-15','CONSULTATION','16:30:00.000000','gh','16:00:00.000000','CANCELLED',1,3,21),(62,'2026-08-19','CONSULTATION','16:00:00.000000','dsfasdf\n','15:30:00.000000','CANCELLED',1,3,21),(63,'2026-08-20','CONSULTATION','16:30:00.000000','sss','16:00:00.000000','CANCELLED',1,4,21),(64,'2026-08-06','CONSULTATION','17:00:00.000000','d\n','16:30:00.000000','CANCELLED',1,3,21),(65,'2026-09-05','CONSULTATION','16:00:00.000000','ddhdd','15:30:00.000000','CANCELLED',1,3,21),(66,'2026-08-12','CONSULTATION','17:00:00.000000','jj','16:30:00.000000','CANCELLED',1,3,25),(67,'2026-08-26','CONSULTATION','14:30:00.000000','dfd','14:00:00.000000','CANCELLED',1,3,26),(68,'2026-08-26','CONSULTATION','17:00:00.000000','wqrqewr','16:30:00.000000','CANCELLED',1,3,27),(69,'2026-08-15','CONSULTATION','16:30:00.000000','pagal hogya hu\n','16:00:00.000000','COMPLETED',1,3,28),(70,'2026-08-26','CONSULTATION','16:30:00.000000','gh','16:00:00.000000','CANCELLED',1,3,24),(71,'2026-08-20','CONSULTATION','17:00:00.000000','gh','16:30:00.000000','CANCELLED',1,3,21),(72,'2026-08-11','CONSULTATION','17:30:00.000000','jj','17:00:00.000000','CANCELLED',1,3,21),(73,'2026-08-21','CONSULTATION','17:00:00.000000','mmm','16:30:00.000000','COMPLETED',1,3,24),(74,'2026-08-20','CONSULTATION','17:00:00.000000','1232\n','16:30:00.000000','CANCELLED',1,3,24),(75,'2026-08-19','CONSULTATION','15:30:00.000000','vh\n','15:00:00.000000','CANCELLED',1,3,24),(76,'2026-08-10','CONSULTATION','17:00:00.000000','jj','16:30:00.000000','COMPLETED',1,3,21),(77,'2026-08-31','CONSULTATION','17:00:00.000000','ajj ki paymetn\n','16:30:00.000000','CANCELLED',1,4,21),(78,'2026-09-05','CONSULTATION','17:30:00.000000','hhh','17:00:00.000000','CANCELLED',1,3,21),(79,'2026-09-05','CONSULTATION','17:30:00.000000','uu','17:00:00.000000','CANCELLED',1,3,21),(80,'2026-08-15','CONSULTATION','12:00:00.000000','drfdf','11:30:00.000000','PENDING',1,4,21),(81,'2026-08-11','CONSULTATION','17:00:00.000000','asfsd','16:30:00.000000','PENDING',8,5,21),(82,'2026-08-21','CONSULTATION','16:30:00.000000','','16:00:00.000000','COMPLETED',1,3,21),(83,'2026-08-12','CONSULTATION','16:30:00.000000','cds','16:00:00.000000','COMPLETED',1,3,24),(84,'2026-08-13','CONSULTATION','15:00:00.000000','higher fever and vomitting\n','14:30:00.000000','COMPLETED',1,3,29),(85,'2026-08-12','CONSULTATION','16:00:00.000000','ETE','15:30:00.000000','COMPLETED',1,3,29),(86,'2026-08-19','CONSULTATION','16:30:00.000000','rr','16:00:00.000000','CANCELLED',1,3,29),(87,'2026-08-13','CONSULTATION','16:00:00.000000','arere','15:30:00.000000','COMPLETED',1,3,21);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `department_id` bigint NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `UKf5np34wnxt905fwmrs6133l28` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Cardiology','Diagnosis and treatment of heart and vascular disorders.'),(2,'Neurology','Care for brain, spinal cord, and nervous system conditions.'),(3,'Orthopedics','Treatment of musculoskeletal system, bones, joints, and ligaments.'),(4,'Pediatrics','Specialized healthcare for infants, children, and adolescents.'),(5,'Dermatology','Treatment of skin, hair, nails, and cosmetic disorders.'),(6,'Gynecology','Care for women\'s reproductive health, pregnancy, and childbirth.'),(7,'General Medicine','Primary care and treatment for common adult illnesses.'),(8,'ENT','Diagnosis and treatment of ear, nose, throat, head, and neck disorders.'),(9,'Ophthalmology','Eye health, vision care, and ophthalmic surgeries.'),(10,'Psychiatry','Treatment of mental health, behavioral, and emotional disorders.'),(11,'meri department','dfdf');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctorid` bigint NOT NULL AUTO_INCREMENT,
  `availability_status` enum('AVAILABLE','NOT_AVAILABLE','ON_LEAVE') DEFAULT NULL,
  `consultation_fee` double NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `license_number` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `room_number` int DEFAULT NULL,
  `specialization` varchar(255) NOT NULL,
  `years_of_experience` int NOT NULL,
  `department_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`doctorid`),
  UNIQUE KEY `UKqp93rhmjry3jlfr9thw5hmgty` (`license_number`),
  UNIQUE KEY `UK3q0j5r6i4e9k3afhypo6uljph` (`user_id`),
  KEY `FK75x47tyyeco3xj4cmlhj8v6ta` (`department_id`),
  CONSTRAINT `FK11wrxiolc8qa2e64s32xc2yy4` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`),
  CONSTRAINT `FK75x47tyyeco3xj4cmlhj8v6ta` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (3,'AVAILABLE',1,'Senior specialist in Neurology with extensive experience in clinical care.','LIC-NEUR-003','MBBS, MD, DM (Neurolgy)',103,'Neurology',18,1,4),(4,'AVAILABLE',700,'Senior specialist in Neurology with extensive experience in clinical care.','LIC-NEUR-004','MBBS, DNB, DM (Neurology)',104,'Neurology',10,1,5),(5,'AVAILABLE',1400,'Senior specialist in Orthopedics with extensive experience in clinical care.','LIC-ORTH-005','MBBS, MS (Orthopedics)',105,'Orthopedics',20,8,6),(6,'AVAILABLE',500,'Senior specialist in Orthopedics with extensive experience in clinical care.','LIC-ORTH-006','MBBS, DNB (Orthopedics)',106,'Orthopedics',8,1,7),(7,'ON_LEAVE',800,'Senior specialist in Pediatrics with extensive experience in clinical care.','LIC-PEDI-007','MBBS, MD (Pediatrics)',107,'Pediatrics',14,1,8),(9,'AVAILABLE',700,'Senior specialist in Dermatology with extensive experience in clinical care.','LIC-DERM-009','MBBS, MD (Dermatology)',109,'Dermatology',16,5,10),(10,'AVAILABLE',900,'Senior specialist in Dermatology with extensive experience in clinical care.','LIC-DERM-010','MBBS, DDVL',110,'Dermatology',7,5,11),(11,'AVAILABLE',700,'Senior specialist in Gynecology with extensive experience in clinical care.','LIC-GYNE-011','MBBS, MS (Gynecology)',201,'Gynecology',22,6,12),(12,'ON_LEAVE',1000,'Senior specialist in Gynecology with extensive experience in clinical care.','LIC-GYNE-012','MBBS, DGO, DNB',202,'Gynecology',13,6,13),(13,'NOT_AVAILABLE',1000,'Senior specialist in General Medicine with extensive experience in clinical care.','LIC-MED-013','MBBS, MD (General Medicine)',203,'General Medicine',25,7,14),(14,'AVAILABLE',1400,'Senior specialist in General Medicine with extensive experience in clinical care.','LIC-MED-014','MBBS, MD (Internal Medicine)',204,'General Medicine',9,7,15),(15,'AVAILABLE',900,'Senior specialist in ENT with extensive experience in clinical care.','LIC-ENT-015','MBBS, MS (ENT)',205,'ENT',17,8,16),(16,'AVAILABLE',1000,'Senior specialist in ENT with extensive experience in clinical care.','LIC-ENT-016','MBBS, DLO',206,'ENT',6,8,17),(17,'AVAILABLE',700,'Senior specialist in Ophthalmology with extensive experience in clinical care.','LIC-OPHT-017','MBBS, MS (Ophthalmology)',207,'Ophthalmology',19,9,18),(18,'ON_LEAVE',1300,'Senior specialist in Ophthalmology with extensive experience in clinical care.','LIC-OPHT-018','MBBS, DOMS',208,'Ophthalmology',10,9,19),(19,'AVAILABLE',1200,'Senior specialist in Psychiatry with extensive experience in clinical care.','LIC-PSYC-019','MBBS, MD (Psychiatry)',209,'Psychiatry',15,7,20),(20,'NOT_AVAILABLE',1000,'Senior specialist in Psychiatry with extensive experience in clinical care.','LIC-PSYC-020','MBBS, DPM',210,'Psychiatry',8,7,21),(21,'AVAILABLE',1,NULL,'121243','MBBS, MD, DM (Neurology)',12,'Cardiologist',5,8,51),(23,'AVAILABLE',1,NULL,'1212121EC','MBBS',121,'Cardiology',1,8,53);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicine_master`
--

DROP TABLE IF EXISTS `medicine_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_master` (
  `medicine_id` bigint NOT NULL AUTO_INCREMENT,
  `dosage_form` varchar(50) DEFAULT NULL,
  `generic_name` varchar(100) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `strength` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`medicine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine_master`
--

LOCK TABLES `medicine_master` WRITE;
/*!40000 ALTER TABLE `medicine_master` DISABLE KEYS */;
INSERT INTO `medicine_master` VALUES (1,'Tablet','Paracetamol',_binary '','Sun Pharma','Paracetamol 500','5122'),(2,'Tablet','Paracetamol',_binary '','GSK','Crocin 650','650 mg'),(3,'Tablet','Paracetamol',_binary '','Micro Labs','Dolo 650','650 mg'),(4,'Capsule','Amoxicillin',_binary '','Cipla','Amoxicillin 500','500 mg'),(5,'Tablet','Azithromycin',_binary '','Abbott','Azithromycin 500','500 mg'),(6,'Tablet','Cefixime',_binary '','Lupin','Cefixime 200','200 mg'),(7,'Tablet','Pantoprazole',_binary '','Sun Pharma','Pantoprazole 40','40 mg'),(8,'Capsule','Omeprazole',_binary '','Dr Reddy\'s','Omeprazole 20','20 mg'),(9,'Tablet','Metformin',_binary '','USV','Metformin 500','500 mg'),(10,'Tablet','Metformin',_binary '','USV','Metformin 1000','1000 mg'),(11,'Tablet','Amlodipine',_binary '','Torrent','Amlodipine 5','5 mg'),(12,'Tablet','Telmisartan',_binary '','Cipla','Telmisartan 40','40 mg'),(13,'Tablet','Atorvastatin',_binary '','Pfizer','Atorvastatin 10','10 mg'),(14,'Tablet','Levocetirizine',_binary '','Cipla','Levocetirizine 5','5 mg'),(15,'Tablet','Cetirizine',_binary '','Sun Pharma','Cetirizine 10','10 mg'),(16,'Tablet','Montelukast',_binary '','Mankind','Montelukast 10','10 mg'),(17,'Tablet','Ascorbic Acid',_binary '','Himalaya','Vitamin C','500 mg'),(18,'Powder','Oral Rehydration Salts',_binary '','Electral','ORS Powder','21.8 g'),(19,'Injection','Human Insulin',_binary '','Novo Nordisk','Insulin Regular','100 IU/ml'),(20,'Gel','Diclofenac',_binary '','Volini','Diclofenac Gel','1%'),(21,'200','vai',_binary '','vaihav','vaibhav200','300'),(22,'1212','rdfgadg',_binary '\0','1214','dol2323','dfdf'),(23,'ff','ff',_binary '','ff','ff','fff'),(24,'cuuu==','sushant gay',_binary '','gaysushant','sushantwagh4232','1222'),(25,'Tablet','subodh',_binary '','subu','subo120','500');
/*!40000 ALTER TABLE `medicine_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_time` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`),
  KEY `FK83nsrttkwkb6ym0anu051mtxn` (`user_id`),
  CONSTRAINT `FK83nsrttkwkb6ym0anu051mtxn` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
INSERT INTO `password_reset_token` VALUES (1,'2026-08-03 20:37:11.163517','8cb1bf25-960d-427a-b95b-fff5ee67dad0',_binary '\0',43),(2,'2026-08-06 00:31:46.500905','7071ee77-8a11-4459-8bd9-4e5f9c43d4a2',_binary '\0',43),(3,'2026-08-06 18:45:24.348053','19e6970c-a9dd-4ef7-876c-b7431dd4ea6e',_binary '\0',43),(4,'2026-08-06 19:01:28.711875','3cd74a9c-2513-4779-972d-86b08a4faa13',_binary '\0',43),(5,'2026-08-06 19:02:17.898873','3d405098-b24f-4753-8ec1-89af59e34b2d',_binary '\0',1),(6,'2026-08-06 19:10:04.331221','42cbe100-7083-45be-a006-c92d54790285',_binary '\0',46),(7,'2026-08-06 19:13:14.685960','18e70fa7-8090-4c8e-81e1-044f31ba3443',_binary '\0',46),(8,'2026-08-06 19:15:42.808924','6c2e5da9-c581-4080-9716-026e2c137dab',_binary '\0',46),(9,'2026-08-06 19:18:37.536801','a66557de-e80b-436d-9ed3-60d34ea372b7',_binary '\0',46),(10,'2026-08-06 22:40:52.003409','9d43e0a8-d517-42ce-a73c-4f046e5d6895',_binary '\0',47),(11,'2026-08-07 16:13:39.817856','199684ee-40ca-4e74-9489-019cb591f71c',_binary '\0',48),(12,'2026-08-07 19:25:22.293785','78317bbc-1cbb-4c7a-baa0-ad9c2cbe6bf5',_binary '\0',49),(13,'2026-08-10 02:56:55.912780','342bb8ee-3143-45af-92b1-594b8e837bc9',_binary '',43),(14,'2026-08-10 17:14:54.286164','4dde13bc-bcdd-446a-b927-c1ced1de3981',_binary '\0',55);
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` bigint NOT NULL AUTO_INCREMENT,
  `blood_group` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(50) DEFAULT NULL,
  `emergency_contact_number` varchar(15) DEFAULT NULL,
  `emergency_contact_relation` varchar(20) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `UK9tbsl3fmey0eofbm2xj69v4qs` (`user_id`),
  CONSTRAINT `FKuwca24wcd1tg6pjex8lmc0y7` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'B-','Gender: Male, Height: 178 cm, Weight: 75 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Aarav','9833000000','Father',22),(2,'B+','Gender: Male, Height: 172 cm, Weight: 68 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Vihaan','9833000001','Spouse',23),(3,'O+','Gender: Male, Height: 180 cm, Weight: 82 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Aditya','9833000002','Mother',24),(4,'AB+','Gender: Male, Height: 175 cm, Weight: 70 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Arjun','9833000003','Spouse',25),(5,'A-','Gender: Male, Height: 170 cm, Weight: 65 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Sai','9833000004','Brother',26),(6,'B-','Gender: Male, Height: 168 cm, Weight: 62 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Reyansh','9833000005','Parent',27),(7,'O-','Gender: Male, Height: 176 cm, Weight: 74 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Ishaan','9833000006','Sister',28),(8,'AB-','Gender: Male, Height: 182 cm, Weight: 79 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Krishna','9833000007','Spouse',29),(9,'A+','Gender: Female, Height: 162 cm, Weight: 55 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Aanya','9833000008','Husband',30),(10,'B+','Gender: Female, Height: 158 cm, Weight: 50 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Diya','9833000009','Father',31),(11,'O+','Gender: Female, Height: 165 cm, Weight: 58 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Pihu','9833000010','Mother',32),(12,'AB+','Gender: Female, Height: 160 cm, Weight: 52 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Prisha','9833000011','Husband',33),(13,'A-','Gender: Female, Height: 163 cm, Weight: 54 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Ananya','9833000012','Parent',34),(14,'B-','Gender: Female, Height: 161 cm, Weight: 53 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Riya','9833000013','Brother',35),(15,'O+','Gender: Male, Height: 174 cm, Weight: 71 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Advik','9833000014','Spouse',36),(16,'A+','Gender: Male, Height: 177 cm, Weight: 73 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Atharv','9833000015','Father',37),(17,'B+','Gender: Female, Height: 159 cm, Weight: 51 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Ishita','9833000016','Mother',38),(18,'O-','Gender: Female, Height: 166 cm, Weight: 56 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Kavya','9833000017','Husband',39),(19,'AB+','Gender: Male, Height: 181 cm, Weight: 80 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Shaurya','9833000018','Sister',40),(20,'A+','Gender: Male, Height: 173 cm, Weight: 69 kg. General medical history: Patient is in overall good health, reports occasional seasonal allergies.','Emergency Contact of Vivaan','9833000019','Brother',41),(21,'O+','sdfalksdfjals','dfd','1234567890','dd',43),(22,'A+','None','Jane Doe','9876543210','Spouse',44),(23,'B+','fdsf','gf','1234567890','ts',45),(24,'B-','flue,fever','david','8989898989','broth',42),(25,'B-','werqwer','asdfasf','6266208846','adf',46),(26,'A-','utakrsh','13123','6266208846','sdfasf',47),(27,'AB+','','wagh','1234567890','dad',48),(28,'A+','dfasdf','harsh','8959288449','spous',49),(29,'A-','higher fever ,sickness','henry walker','8959288449','Father',54),(30,'B+','dfadsf','jfalksdjf','1212121212','df',55);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `failure_reason` varchar(500) DEFAULT NULL,
  `order_status` enum('ATTEMPTED','CANCELLED','CREATED','EXPIRED','PAID') DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_method` enum('CARD','NETBANKING','UPI','WALLET') DEFAULT NULL,
  `payment_status` enum('CANCELLED','FAILED','PENDING','REFUNDED','SUCCESS') DEFAULT NULL,
  `razorpay_fee` decimal(10,2) DEFAULT NULL,
  `razorpay_order_id` varchar(100) NOT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(500) DEFAULT NULL,
  `receipt_number` varchar(255) NOT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refund_id` varchar(255) DEFAULT NULL,
  `refund_status` enum('FAILED','NOT_REQUESTED','PENDING','PROCESSED') DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `appointment_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  `razorpay_refund_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `UKc3w49re3w3eiexjdnm9khcsd8` (`razorpay_order_id`),
  UNIQUE KEY `UKu6rnuxne864s4rh7qgeql1vx` (`receipt_number`),
  UNIQUE KEY `UK3h326otx9ko45mitb1ptj38bi` (`razorpay_payment_id`),
  UNIQUE KEY `UKlq7cjdyw37yu1ppn0wp2dmre2` (`razorpay_refund_id`),
  KEY `FK9a0odew03qao7nlbdsesrux5u` (`appointment_id`),
  KEY `FKg6udxi5v18cvtp1etce1hdroi` (`doctor_id`),
  KEY `FKlvfcgbin5vh2ivae1l87bmawb` (`patient_id`),
  CONSTRAINT `FK9a0odew03qao7nlbdsesrux5u` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`),
  CONSTRAINT `FKg6udxi5v18cvtp1etce1hdroi` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctorid`),
  CONSTRAINT `FKlvfcgbin5vh2ivae1l87bmawb` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1600.00,'2026-08-05 10:27:08.276284','INR',NULL,'PAID','2026-08-05 10:39:25.452576','NETBANKING','REFUNDED',NULL,'order_TLxqoTB7dEhh2r','pay_TLy3TJ2Z7Ckcq6','d78b08ea500275f301f1e2f1d43646cdda9de82397d6498a650bb322eb61f1e9','REC-1785905827724',1600.00,NULL,'PROCESSED',NULL,'2026-08-05 23:17:18.970758',64,3,21,'rfnd_TMAyNjG8f7ZbHf'),(2,1600.00,'2026-08-05 10:52:26.042986','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TLyHX6mFLroULi',NULL,NULL,'REC-1785907344450',NULL,NULL,NULL,NULL,'2026-08-05 10:52:26.042986',62,3,21,NULL),(3,1600.00,'2026-08-05 10:52:26.042986','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TLyHX5Wh5yP2h8',NULL,NULL,'REC-1785907344448',NULL,NULL,NULL,NULL,'2026-08-05 10:52:26.042986',62,3,21,NULL),(4,1600.00,'2026-08-05 10:53:24.013217','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TLyIYVYQEY40r4',NULL,NULL,'REC-1785907403919',NULL,NULL,NULL,NULL,'2026-08-05 10:53:24.013217',62,3,21,NULL),(5,1600.00,'2026-08-05 10:53:30.069792','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TLyIf76haJjQiK',NULL,NULL,'REC-1785907409972',NULL,NULL,NULL,NULL,'2026-08-05 10:53:30.069792',62,3,21,NULL),(6,1600.00,'2026-08-05 12:57:35.818939','INR',NULL,'PAID','2026-08-05 12:58:04.139373','NETBANKING','REFUNDED',NULL,'order_TM0PkIMQ6cswJk','pay_TM0PxeFFOtN9sT','71fc15e667d97fa2027064d4407912cdcc4df3f12de91b226c1bb909abe3bfd3','REC-1785914855244',1600.00,NULL,'PROCESSED',NULL,'2026-08-05 21:02:38.339105',62,3,21,'rfnd_TM8g7LGnlGayDV'),(9,1600.00,'2026-08-05 13:17:11.242087','INR',NULL,'PAID','2026-08-05 13:19:54.385891','WALLET','REFUNDED',NULL,'order_TM0kRGZKdZqNxT','pay_TM0l6bRqow4xve','4727f29f224501ff9b3cd79bc553c7337b3d39e6e810d610b1a812e21328edf2','REC-1785916029494',1600.00,NULL,'PROCESSED',NULL,'2026-08-05 23:17:24.368555',61,3,21,'rfnd_TMAyTeF3JJ8R6z'),(10,1200.00,'2026-08-05 13:22:25.605058','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TM0pyVzSY8CzPI',NULL,NULL,'REC-1785916345514',NULL,NULL,NULL,NULL,'2026-08-05 13:22:25.605058',59,4,21,NULL),(11,1200.00,'2026-08-05 13:22:25.696977','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TM0pyd5QruMbaj',NULL,NULL,'REC-1785916345532',NULL,NULL,NULL,NULL,'2026-08-05 13:22:25.696977',59,4,21,NULL),(12,1200.00,'2026-08-05 13:26:55.001689','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TM0uiZzKBBnabt',NULL,NULL,'REC-1785916614941',NULL,NULL,NULL,NULL,'2026-08-05 13:26:55.001689',63,4,21,NULL),(13,1200.00,'2026-08-05 13:26:55.016929','INR',NULL,'PAID','2026-08-05 13:27:20.717676','WALLET','REFUNDED',NULL,'order_TM0uiaCTS56OWx','pay_TM0urfYSVWpLRu','4dc01ea86c5ac8e9e127d51a8d13c0ae785409fbcefdce43e5238cd6fc1aa023','REC-1785916614936',1200.00,NULL,'PROCESSED',NULL,'2026-08-08 03:48:40.910148',63,4,21,'rfnd_TN8Hrzc8SkSQ21'),(15,1200.00,'2026-08-05 13:41:25.337630','INR',NULL,'PAID','2026-08-05 13:41:56.155088','NETBANKING','REFUNDED',NULL,'order_TM1A2DMAfx7hZa','pay_TM1AGTA8jQUE4P','eee02d4867411a67b78300914316ec7450579df33fea585db5b2052b0a0015e0','REC-1785917483870',1200.00,NULL,'PROCESSED',NULL,'2026-08-05 23:31:50.081447',59,4,21,'rfnd_TMBDicIyAMonIB'),(16,1600.00,'2026-08-05 19:16:09.351503','INR',NULL,'PAID','2026-08-05 19:18:02.755579','NETBANKING','REFUNDED',NULL,'order_TM6rcrQiufDnjB','pay_TM6tL59UPdct2G','b5325642c0d251c6943bb6ee1801ff0ba2afe27120a68f57d64ded73d0001c3a','REC-1785937568909',1600.00,NULL,'PROCESSED',NULL,'2026-08-05 23:22:12.448504',65,3,21,'rfnd_TMB3Y3lIFHk9DF'),(18,1600.00,'2026-08-05 23:26:14.544496','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TMB7p8bbZcTHQI',NULL,NULL,'REC-1785952573080',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-05 23:26:14.544496',60,3,21,NULL),(19,1600.00,'2026-08-05 23:26:14.544496','INR',NULL,'PAID','2026-08-05 23:26:41.802419','NETBANKING','SUCCESS',NULL,'order_TMB7p8MtGF2Cfa','pay_TMB815IQ7pMqwQ','e6e23089db43f897e20fa50efb842232c28e67289a2d2e33fd6ef97d8fe73177','REC-1785952573070',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-05 23:26:41.815471',60,3,21,NULL),(21,1600.00,'2026-08-06 19:11:00.321832','INR',NULL,'PAID','2026-08-06 19:15:41.650054','NETBANKING','REFUNDED',NULL,'order_TMVJKa90OwiuJe','pay_TMVNwA9oB4Mvtf','f0aa9d2dcce4c82f790700bd47da08facfd1708354ddd30de0109500c85dc3a9','REC-1786023659823',1600.00,NULL,'PROCESSED',NULL,'2026-08-06 19:16:56.563157',66,3,25,'rfnd_TMVPaLXR6LeCMo'),(22,1600.00,'2026-08-06 22:32:20.962765','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TMYk0wxi7TlDpV',NULL,NULL,'REC-1786035740536-BFAE80',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-06 22:32:20.962765',67,3,26,NULL),(23,1600.00,'2026-08-06 22:32:20.962765','INR',NULL,'PAID','2026-08-06 22:33:29.450013','NETBANKING','REFUNDED',NULL,'order_TMYk0yfeihbOaC','pay_TMYkvgUBeDgZcD','7c44aec86ef63049632c0d9d74e6e52bda1ae8693b1bdd0c337e20698b8caff7','REC-1786035740536-BAFD1F',1600.00,NULL,'PROCESSED',NULL,'2026-08-06 22:34:44.670687',67,3,26,'rfnd_TMYmX0DT5551xA'),(24,1600.00,'2026-08-07 16:00:30.680698','INR',NULL,'PAID','2026-08-07 16:02:05.237834','NETBANKING','REFUNDED',NULL,'order_TMqbCkYWM5beNZ','pay_TMqcJIKg7KhGGI','98de8d7656771de2e795aea32e439116ec2d712c3da5c447c55b2c80e0e208b4','REC-1786098629747-0EA9C7',1600.00,NULL,'PROCESSED',NULL,'2026-08-07 16:03:18.014810',68,3,27,'rfnd_TMqe8V6gn14MlI'),(25,1600.00,'2026-08-07 16:00:30.693209','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TMqbCkJ5QxwbGx',NULL,NULL,'REC-1786098629747-6FB84B',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-07 16:00:30.693209',68,3,27,NULL),(26,1600.00,'2026-08-07 19:14:39.783049','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TMtuI6pesLc9kT',NULL,NULL,'REC-1786110279428-B287A0',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-07 19:14:39.783049',69,3,28,NULL),(27,1600.00,'2026-08-07 19:14:39.833084','INR',NULL,'PAID','2026-08-07 19:15:11.229432','NETBANKING','SUCCESS',NULL,'order_TMtuIBjmZj8RPq','pay_TMtuXdjaf8vdVA','a78b74ccf0b36af7a5c6adf88a8e190221011f44d3bc546fa7379264c087ab91','REC-1786110279428-56808A',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-07 19:15:11.245594',69,3,28,NULL),(28,1600.00,'2026-08-08 03:19:49.612336','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TN7nP1i2Z1lLlU',NULL,NULL,'REC-1786139388471-112AB4',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:19:49.612336',70,3,24,NULL),(29,1600.00,'2026-08-08 03:19:49.612336','INR',NULL,'PAID','2026-08-08 03:20:17.791342','NETBANKING','REFUNDED',NULL,'order_TN7nP21Srb2Tvm','pay_TN7nc4mdvSbBGb','0383a53d0a0ade6bc0ca7cbac6f9d554b23770f31b482df8ec3bac049c8381ca','REC-1786139388471-AF3AAF',1600.00,NULL,'PROCESSED',NULL,'2026-08-08 03:22:05.464788',70,3,24,'rfnd_TN7pmKVypZBFJC'),(30,511.00,'2026-08-08 03:38:40.763111','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TN87Jh5pFouV69',NULL,NULL,'REC-1786140520078-2D7AC5',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:38:40.764113',58,3,24,NULL),(31,511.00,'2026-08-08 03:38:40.763111','INR',NULL,'PAID','2026-08-08 03:43:36.845367','NETBANKING','SUCCESS',NULL,'order_TN87JllbkRSz9y','pay_TN8CDxwP9QF2Z2','3997dcca1ca2024b1a780d1c806ae4fc573d19c9a6df3b053d6ca5edc65253b7','REC-1786140520078-5A58CD',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:43:36.877752',58,3,24,NULL),(32,511.00,'2026-08-08 03:51:07.030724','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TN8KSLcP7Ah1wL',NULL,NULL,'REC-1786141266911-3520EE',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:51:07.030724',71,3,21,NULL),(33,511.00,'2026-08-08 03:51:07.082838','INR',NULL,'PAID','2026-08-08 03:51:28.578155','WALLET','REFUNDED',NULL,'order_TN8KSQDsrSutZS','pay_TN8KY7lJppNQYN','7beee86ff47df457578ff646c9310d37dc1267ad7d11aed8e1d94182e1889214','REC-1786141266912-EAF843',511.00,NULL,'PROCESSED',NULL,'2026-08-08 05:13:33.962531',71,3,21,'rfnd_TN9jWnrszfAMAK'),(34,511.00,'2026-08-08 03:56:14.901249','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TN8PsNLhDv6jO4',NULL,NULL,'REC-1786141574258-9EDC69',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:56:14.901249',72,3,21,NULL),(35,511.00,'2026-08-08 03:56:14.901249','INR',NULL,'PAID','2026-08-08 03:56:42.859724','NETBANKING','SUCCESS',NULL,'order_TN8PsMzgsHegWV','pay_TN8Q48Iw15viNd','fc192064d192fffe057d79bdbad74125da2d215a265d174e52f37a89cf1dc495','REC-1786141574258-9F129A',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 03:56:42.898517',72,3,21,NULL),(36,511.00,'2026-08-08 05:14:11.783127','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TN9kDKqM8in1Pl',NULL,NULL,'REC-1786146251573-091021',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 05:14:11.783127',73,3,24,NULL),(37,511.00,'2026-08-08 05:14:11.814130','INR',NULL,'PAID','2026-08-08 05:14:39.659346','NETBANKING','SUCCESS',NULL,'order_TN9kDPDRLDir3X','pay_TN9kOQyVrTZXTA','89d8740f260cba98207ec793c4dd328ce9de626261adec8c5cd931afbb786f50','REC-1786146251574-2E2C99',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 05:14:39.678081',73,3,24,NULL),(38,501.00,'2026-08-08 06:05:51.086178','INR',NULL,'PAID','2026-08-08 06:06:40.685447','NETBANKING','SUCCESS',NULL,'order_TNAcmK8fCJVUFq','pay_TNAdLx7DdViBz1','963221ebc284d0bc5c1445419b53af31e4199301c71bf7b4d7ca19cf5cacb48b','REC-1786149350590-439FA4',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 06:06:40.702534',74,3,24,NULL),(39,501.00,'2026-08-08 06:05:51.086178','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNAcmKCGPkx3aq',NULL,NULL,'REC-1786149350590-CA4E87',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 06:05:51.086178',74,3,24,NULL),(40,2.00,'2026-08-08 06:12:32.092158','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNAjq1MicDyerb',NULL,NULL,'REC-1786149751697-E2008F',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 06:12:32.092158',75,3,24,NULL),(41,2.00,'2026-08-08 06:12:32.092158','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNAjq0NrMv8JRe',NULL,NULL,'REC-1786149751697-4E1490',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-08 06:12:32.092158',75,3,24,NULL),(42,2.00,'2026-08-09 14:20:10.318687','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNbxTMByR0V8RX',NULL,NULL,'REC-1786265409760-8F8A51',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:20:10.319786',76,3,21,NULL),(43,2.00,'2026-08-09 14:20:10.411636','INR',NULL,'PAID','2026-08-09 14:20:42.547978','NETBANKING','SUCCESS',NULL,'order_TNbxTUhyAG8Tfh','pay_TNbxhaQzv2BXDQ','c77bb19528f70db055d63d036bd8bf3826f2e0273c5a4a3499de1c74bc8af473','REC-1786265409760-ADC0B9',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:20:42.568450',76,3,21,NULL),(44,701.00,'2026-08-09 14:30:26.938329','INR',NULL,'PAID','2026-08-09 14:30:53.632986','WALLET','SUCCESS',NULL,'order_TNc8KRJevEeT82','pay_TNc8USf6XK7pK0','8cdf58ff0c929da5093097e344e62f6c3d8a9f4a8abc3927067c28c78a857253','REC-1786266026406-CBC8A4',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:30:53.667888',77,4,21,NULL),(45,701.00,'2026-08-09 14:30:26.938329','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNc8KRQiYpwSJm',NULL,NULL,'REC-1786266026394-2435BD',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:30:26.938329',77,4,21,NULL),(46,2.00,'2026-08-09 14:35:56.931782','INR',NULL,'PAID','2026-08-09 14:36:23.165912','NETBANKING','SUCCESS',NULL,'order_TNcE8dgKaWkSS9','pay_TNcEJGRdNgNih7','32994d2b94c35314d0532cdbe94ee959dc6e5281e1a4eb921a1aaa8110b63d92','REC-1786266356401-39D2FE',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:36:23.197799',78,3,21,NULL),(47,2.00,'2026-08-09 14:35:56.931782','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNcE8esvuFFFem',NULL,NULL,'REC-1786266356400-212FD1',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 14:35:56.931782',78,3,21,NULL),(48,2.00,'2026-08-09 19:45:33.611479','INR',NULL,'PAID','2026-08-09 19:46:00.153142','NETBANKING','SUCCESS',NULL,'order_TNn7nN3lgZetKi','pay_TNn7xTnhAygzcJ','558486c08b8a300fc2495a3c6f36b35c9e1e698559e53ef16c53dba0cdff553e','REC-1786284933103-BD1F25',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-09 19:46:00.181411',79,3,21,NULL),(49,701.00,'2026-08-10 01:21:08.508060','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNnDgFSrTTlBUI',NULL,NULL,'REC-1786305068312-57994E',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 01:21:08.508060',80,4,21,NULL),(50,1401.00,'2026-08-10 01:24:01.825723','INR',NULL,'CREATED',NULL,NULL,'PENDING',NULL,'order_TNnGjQUGqhKUVo',NULL,NULL,'REC-1786305241740-F7E992',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 01:24:01.825723',81,5,21,NULL),(51,2.00,'2026-08-10 08:33:00.313517','INR',NULL,'PAID','2026-08-10 08:33:28.532030','NETBANKING','SUCCESS',NULL,'order_TNuZqYLkviu6oQ','pay_TNua2alVe2vskN','b3762c0624ca31a042467d336abb3270c33bd14b43b594935440748d79e318d1','REC-1786330977047-3A6BE1',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 08:33:28.557590',82,3,21,NULL),(52,2.00,'2026-08-10 10:30:17.836520','INR',NULL,'PAID','2026-08-10 10:30:46.164205','NETBANKING','SUCCESS',NULL,'order_TNwZlERx4Nct4T','pay_TNwZyDVIAUE5Tl','d1a7d6bf91ed8b8a4cf078d70fd4acd90869a4a73ce49050146522626e715929','REC-1786338017308-E43741',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 10:30:46.189177',83,3,24,NULL),(53,2.00,'2026-08-10 12:41:38.877541','INR',NULL,'PAID','2026-08-10 12:42:43.413553','NETBANKING','SUCCESS',NULL,'order_TNyoVXRZR6O4r1','pay_TNyp1aOdGKAagf','58aef5a91b1371ee98bf87929df91734e5dd15e95de73fb0943ec6ed5e17e383','REC-1786345897797-58C215',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 12:42:43.461212',84,3,29,NULL),(54,2.00,'2026-08-10 13:06:26.067673','INR',NULL,'PAID','2026-08-10 13:07:14.739235','NETBANKING','SUCCESS',NULL,'order_TNzEgvE4HbZJOz','pay_TNzFDT88SQr2W5','018cdb7ae92846471278d6a2707602c5867eb6156b58ce0bb43dc75eaa93d4f1','REC-1786347385234-062549',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 13:07:14.797710',85,3,29,NULL),(55,2.00,'2026-08-10 13:42:01.110360','INR',NULL,'PAID','2026-08-10 13:42:43.213147','WALLET','REFUNDED',NULL,'order_TNzqGwqhGkchXW','pay_TNzqeXCdfJHrKG','70e7ac576e768e7ebe5391a120e8d11dcd134fef4d9215176aa30e7a782ca25b','REC-1786349519235-D37E59',2.00,NULL,'PROCESSED',NULL,'2026-08-10 13:47:30.334628',86,3,29,'rfnd_TNzw2E1BVzS4O4'),(56,2.00,'2026-08-10 13:59:47.078369','INR',NULL,'PAID','2026-08-10 14:00:31.731006','NETBANKING','SUCCESS',NULL,'order_TO092XjPA60nCh','pay_TO09PuvRBrPdVm','83fe11c981312b7d4296c924b8b40fe44d0dbf4ff5662659fc2bd4712956f87f','REC-1786350584184-763F27',NULL,NULL,'NOT_REQUESTED',NULL,'2026-08-10 14:00:31.806610',87,3,21,NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription` (
  `prescription_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `diagnosis` varchar(500) NOT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `appointment_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`prescription_id`),
  UNIQUE KEY `UKqiwnn1r91ywfuflspffy0rsse` (`appointment_id`),
  CONSTRAINT `FKgl6h3kbge7ep19392gskq2yc6` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES (1,'2026-07-06 20:42:03.175743','Atopic Dermatitis','Take medications strictly at specified times. Return immediately if symptoms worsen.',23,NULL),(2,'2026-07-06 20:42:03.177881','Osteoarthritis of the Knee','Take medications strictly at specified times. Return immediately if symptoms worsen.',19,NULL),(3,'2026-07-06 20:42:03.179931','General Anxiety Disorder','Regular walking, reduce intake of simple carbohydrates.',29,NULL),(4,'2026-07-06 20:42:03.182081','Osteoarthritis of the Knee','Apply ointment twice daily on clean, dry skin.',3,NULL),(5,'2026-07-06 20:42:03.184249','General Anxiety Disorder','Take medications post meals. Review in 2 weeks.',40,NULL),(6,'2026-07-06 20:42:03.185924','Migraine Headache','Apply ointment twice daily on clean, dry skin.',13,NULL),(7,'2026-07-06 20:42:03.188044','General Anxiety Disorder','Drink plenty of fluids. Avoid heavy or oily foods.',27,NULL),(8,'2026-07-06 20:42:03.190133','Acute Sinusitis','Take medications strictly at specified times. Return immediately if symptoms worsen.',42,NULL),(9,'2026-07-06 20:42:03.192336','Acute Bronchitis','Take medications post meals. Review in 2 weeks.',10,NULL),(10,'2026-07-06 20:42:03.193925','Iron Deficiency Anemia','Drink plenty of fluids. Avoid heavy or oily foods.',24,NULL),(11,'2026-07-06 20:42:03.194933','Osteoarthritis of the Knee','Drink plenty of fluids. Avoid heavy or oily foods.',47,NULL),(12,'2026-07-06 20:42:03.198418','Iron Deficiency Anemia','Regular walking, reduce intake of simple carbohydrates.',50,NULL),(13,'2026-07-06 20:42:03.200964','Vitamin D Deficiency','Drink plenty of fluids. Avoid heavy or oily foods.',25,NULL),(14,'2026-07-06 20:42:03.203958','Migraine Headache','Take medications post meals. Review in 2 weeks.',49,NULL),(15,'2026-07-06 20:42:03.206483','Type 2 Diabetes Mellitus','Take medications strictly at specified times. Return immediately if symptoms worsen.',15,NULL),(16,'2026-07-06 20:42:03.210056','Gastroesophageal Reflux Disease (GERD)','Take medications strictly at specified times. Return immediately if symptoms worsen.',17,NULL),(17,'2026-07-06 20:42:03.213995','Iron Deficiency Anemia','Avoid strenuous physical activity for a week. Monitor blood pressure daily.',8,NULL),(18,'2026-07-06 20:42:03.216500','General Anxiety Disorder','Regular walking, reduce intake of simple carbohydrates.',44,NULL),(19,'2026-07-06 20:42:03.218439','Iron Deficiency Anemia','Regular walking, reduce intake of simple carbohydrates.',6,NULL),(20,'2026-07-06 20:42:03.221394','Acute Bronchitis','Take medications strictly at specified times. Return immediately if symptoms worsen.',32,NULL),(21,'2026-07-06 20:42:03.224109','Acute Tonsillitis','Take medications post meals. Review in 2 weeks.',48,NULL),(22,'2026-07-06 20:42:03.226248','General Anxiety Disorder','Regular walking, reduce intake of simple carbohydrates.',31,NULL),(23,'2026-07-06 20:42:03.229025','Iron Deficiency Anemia','Drink plenty of fluids. Avoid heavy or oily foods.',28,NULL),(24,'2026-07-06 20:42:03.231791','Acute Sinusitis','Apply ointment twice daily on clean, dry skin.',14,NULL),(25,'2026-07-06 20:42:03.234490','Atopic Dermatitis','Apply ointment twice daily on clean, dry skin.',2,NULL),(26,'2026-07-06 20:42:03.236593','Acute Bronchitis','Take medications strictly at specified times. Return immediately if symptoms worsen.',30,NULL),(27,'2026-07-06 20:42:03.239239','Acute Bronchitis','Take medications strictly at specified times. Return immediately if symptoms worsen.',22,NULL),(28,'2026-07-06 20:42:03.241445','Type 2 Diabetes Mellitus','Drink plenty of fluids. Avoid heavy or oily foods.',4,NULL),(29,'2026-07-06 20:42:03.244763','Vitamin D Deficiency','Avoid strenuous physical activity for a week. Monitor blood pressure daily.',45,NULL),(30,'2026-07-06 20:42:03.250464','Gastroesophageal Reflux Disease (GERD)','Apply ointment twice daily on clean, dry skin.',41,NULL),(31,'2026-08-01 12:22:45.843446','ueuw','eyee\n\\',12,'2026-08-01 12:22:45.843446'),(32,'2026-08-04 23:46:59.523262','dfd','ddd',38,NULL),(33,'2026-08-05 03:24:33.132869','HOIHIUHIH','UIHIHIUHIUH',60,NULL),(34,'2026-08-07 19:18:50.425594','fgrsdfgdzsf]','fgsdg',69,NULL),(35,'2026-08-10 12:45:10.646734','higher fever','do not eat cold things',84,NULL),(36,'2026-08-10 12:49:30.191661','patient','aptient',83,NULL),(37,'2026-08-10 13:09:08.351767','dfasd',NULL,85,NULL),(38,'2026-08-10 13:45:35.368623','ede','fff',86,NULL),(39,'2026-08-10 14:02:55.191261','ccc','cddc',87,NULL);
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_medicine`
--

DROP TABLE IF EXISTS `prescription_medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_medicine` (
  `prescription_medicine_id` bigint NOT NULL AUTO_INCREMENT,
  `dosage` varchar(50) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `frequency` varchar(50) NOT NULL,
  `instructions` varchar(300) DEFAULT NULL,
  `quantity` varchar(30) DEFAULT NULL,
  `medicine_id` bigint NOT NULL,
  `prescription_id` bigint NOT NULL,
  PRIMARY KEY (`prescription_medicine_id`),
  KEY `FK9rtki26jrhfopfin202stqhk1` (`medicine_id`),
  KEY `FKoehlep3ef56j6rr192owe9gq3` (`prescription_id`),
  CONSTRAINT `FK9rtki26jrhfopfin202stqhk1` FOREIGN KEY (`medicine_id`) REFERENCES `medicine_master` (`medicine_id`),
  CONSTRAINT `FKoehlep3ef56j6rr192owe9gq3` FOREIGN KEY (`prescription_id`) REFERENCES `prescription` (`prescription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_medicine`
--

LOCK TABLES `prescription_medicine` WRITE;
/*!40000 ALTER TABLE `prescription_medicine` DISABLE KEYS */;
INSERT INTO `prescription_medicine` VALUES (1,'199','2d6','2','dddf','2',3,31),(2,'12','1','1','ffff','9',11,31),(3,'ee','34','34','ff','6',3,32),(4,'H','G','G','G','G',5,33),(5,'1432','4','2','dfd','4',4,34),(6,'1','5','2','after meal','10',1,35),(7,'3','1','4','before meal','10',3,35),(8,'12','3','4414','after food','1',3,36),(9,'1','5','4','after meals ','13',1,37),(10,'2','r','rr','frfr','3',3,38),(11,'1','1','1','ccff','1',3,39);
/*!40000 ALTER TABLE `prescription_medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `contactdetails` varchar(10) NOT NULL,
  `date_of_birth` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `timeofcreation` datetime(6) NOT NULL,
  `user_role` enum('ADMIN','DOCTOR','PATIENT') DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Hospital HQ, Mumbai, Maharashtra','9999999999','1985-08-15','admin@hospital.com','Hospital','Admin','$2a$10$/UMr/TiGyWN1kOZf.geAmOYf9mtARrHSUI/5ql6kCTucLOnxQ214O',NULL,'2026-07-06 20:42:02.731427','ADMIN'),(4,'Doctor Colony, Sector 3, New Delhi','9811000002','1984-08-21','amit.patel@hospital.com','Amit','Pate','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu','http://localhost:8080/uploads/photos/bcb8b644-a830-4ab8-9d63-81f5b3cf46d6.png','2026-07-06 20:42:02.776835','DOCTOR'),(5,'Doctor Colony, Sector 7, New Delhi','9811000003','1965-03-20','priya.iyer@hospital.com','Priya','Iyer','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.785443','DOCTOR'),(6,'Doctor Colony, Sector 1, New Delhi','9811000004','1974-04-15','sanjay.gupta@hospital.com','Sanjay','Gupta','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.792410','DOCTOR'),(7,'Doctor Colony, Sector 8, New Delhi','9811000005','1970-10-28','anjali.desai@hospital.com','Anjali','Desai','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.802027','DOCTOR'),(8,'Doctor Colony, Sector 6, New Delhi','9811000006','1965-01-06','vikram.malhotra@hospital.com','Vikram','Malhotra','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.811087','DOCTOR'),(10,'Doctor Colony, Sector 10, New Delhi','9811000008','1977-08-27','sandeep.verma@hospital.com','Sandeep','Verma','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.830583','DOCTOR'),(11,'Doctor Colony, Sector 9, New Delhi','9811000009','1975-03-07','neha.kapoor@hospital.com','Neha','Kapoor','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.841809','DOCTOR'),(12,'Doctor Colony, Sector 4, New Delhi','9811000010','1983-03-24','rakesh.joshi@hospital.com','Rakesh','Joshi','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.852650','DOCTOR'),(13,'Doctor Colony, Sector 6, New Delhi','9811000011','1980-03-12','meenakshi.sundaram@hospital.com','Meenakshi','Sundaram','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.865376','DOCTOR'),(14,'Doctor Colony, Sector 5, New Delhi','9811000012','1980-02-19','anil.mehta@hospital.com','Anil','Mehta','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.877326','DOCTOR'),(15,'Doctor Colony, Sector 9, New Delhi','9811000013','1967-08-19','kavita.reddy@hospital.com','Kavita','Reddy','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.882809','DOCTOR'),(16,'Doctor Colony, Sector 1, New Delhi','9811000014','1979-01-15','manoj.mishra@hospital.com','Manoj','Mishra','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.887205','DOCTOR'),(17,'Doctor Colony, Sector 6, New Delhi','9811000015','1989-02-11','shalini.hegde@hospital.com','Shalini','Hegde','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.893797','DOCTOR'),(18,'Doctor Colony, Sector 2, New Delhi','9811000016','1970-11-19','harish.nair@hospital.com','Harish','Nair','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.899841','DOCTOR'),(19,'Doctor Colony, Sector 3, New Delhi','9811000017','1972-12-27','pooja.bhatia@hospital.com','Pooja','Bhatia','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.904852','DOCTOR'),(20,'Doctor Colony, Sector 8, New Delhi','9811000018','1969-03-01','devendra.singh@hospital.com','Devendra','Singh','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.910897','DOCTOR'),(21,'Doctor Colony, Sector 7, New Delhi','9811000019','1972-09-13','divya.saxena@hospital.com','Divya','Saxena','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-07-06 20:42:02.915900','DOCTOR'),(22,'Apartment 848, Block B, Residency Road, Bangalore','9822000000','1986-02-27','aarav.sharma@gmail.com','Aarav','Sharma','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-07-06 20:42:02.923501','PATIENT'),(23,'Apartment 326, Block B, Residency Road, Bangalore','9822000001','1986-08-26','vihaan.patel@gmail.com','Vihaan','Patel','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.930635','PATIENT'),(24,'Apartment 308, Block B, Residency Road, Bangalore','9822000002','2001-02-01','aditya.verma@gmail.com','Aditya','Verma','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.936446','PATIENT'),(25,'Apartment 822, Block B, Residency Road, Bangalore','9822000003','1981-02-11','arjun.kapoor@gmail.com','Arjun','Kapoor','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.948899','PATIENT'),(26,'Apartment 441, Block B, Residency Road, Bangalore','9822000004','1999-09-20','sai.reddy@gmail.com','Sai','Reddy','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.954218','PATIENT'),(27,'Apartment 639, Block B, Residency Road, Bangalore','9822000005','2000-01-22','reyansh.joshi@gmail.com','Reyansh','Joshi','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.959285','PATIENT'),(28,'Apartment 963, Block B, Residency Road, Bangalore','9822000006','1977-04-06','ishaan.nair@gmail.com','Ishaan','Nair','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.963808','PATIENT'),(29,'Apartment 901, Block B, Residency Road, Bangalore','9822000007','1993-04-01','krishna.iyer@gmail.com','Krishna','Iyer','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.968830','PATIENT'),(30,'Apartment 283, Block B, Residency Road, Bangalore','9822000008','1978-11-15','aanya.rao@gmail.com','Aanya','Rao','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.972839','PATIENT'),(31,'Apartment 559, Block B, Residency Road, Bangalore','9822000009','1996-04-09','diya.gupta@gmail.com','Diya','Gupta','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.977044','PATIENT'),(32,'Apartment 985, Block B, Residency Road, Bangalore','9822000010','1976-09-28','pihu.mehta@gmail.com','Pihu','Mehta','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.981568','PATIENT'),(33,'Apartment 729, Block B, Residency Road, Bangalore','9822000011','1996-12-22','prisha.saxena@gmail.com','Prisha','Saxena','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.986070','PATIENT'),(34,'Apartment 425, Block B, Residency Road, Bangalore','9822000012','1978-01-16','ananya.kumar@gmail.com','Ananya','Kumar','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:02.994855','PATIENT'),(35,'Apartment 606, Block B, Residency Road, Bangalore','9822000013','1992-06-25','riya.sharma@gmail.com','Riya','Sharma','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.002878','PATIENT'),(36,'Apartment 497, Block B, Residency Road, Bangalore','9822000014','1994-10-19','advik.bhatia@gmail.com','Advik','Bhatia','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.009015','PATIENT'),(37,'Apartment 702, Block B, Residency Road, Bangalore','9822000015','1976-07-04','atharv.mishra@gmail.com','Atharv','Mishra','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.014951','PATIENT'),(38,'Apartment 141, Block B, Residency Road, Bangalore','9822000016','1985-03-24','ishita.desai@gmail.com','Ishita','Desai','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.019535','PATIENT'),(39,'Apartment 228, Block B, Residency Road, Bangalore','9822000017','2003-07-18','kavya.hegde@gmail.com','Kavya','Hegde','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.025386','PATIENT'),(40,'Apartment 397, Block B, Residency Road, Bangalore','9822000018','1996-11-13','shaurya.singh@gmail.com','Shaurya','Singh','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.032283','PATIENT'),(41,'Apartment 980, Block B, Residency Road, Bangalore','9822000019','2000-10-02','vivaan.malhotra@gmail.com','Vivaan','Malhotra','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm',NULL,'2026-07-06 20:42:03.036986','PATIENT'),(42,'Sunder Nagar','8886664441','2026-05-04','rutujashirdhone@gmail.com','rituraj','shirdhone','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-07-06 20:50:51.483226','PATIENT'),(43,'sunder nagar','6266208846','2026-07-01','utkarshpawade9@gmail.com','utkarsh','pawade','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','http://localhost:8080/uploads/photos/41be1e44-8907-40f9-a6ec-9608a911f0e0.png','2026-07-06 23:25:10.957554','PATIENT'),(44,'123 Test St.','9876543210','1995-05-15','freshpatient123@gmail.com','Test','Patient','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-07-06 23:36:51.210252','PATIENT'),(45,'pune','8080737184','1999-03-23','ritujashirdhone@gmail.com','rituja','shirdhone','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','http://localhost:8080/uploads/photos/f3821be7-b7d4-476f-bcaa-abe36081f8bb.png','2026-07-31 14:27:11.736060','PATIENT'),(46,'dss','6266208846','2020-10-13','utkarshpawadedbz@gmail.com','utlimate','ridex','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-08-06 18:51:13.722317','PATIENT'),(47,'','6266208846','2026-08-05','vaibhavvchavan1514@gmail.com','vaibhav','chouhan','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-08-06 22:25:21.730066','PATIENT'),(48,'','6266208846','2026-02-01','wsushant547@gmail.com','sushant','waghmare','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-08-07 15:58:26.515190','PATIENT'),(49,'','6266208846','2026-08-05','subodhpatel3007@gmail.com','subodh','patel','$2a$10$GZPSv0QXo1YIv6Hp8jXSTuJfjHtyHZBNlQ.aBZe9jjUWz3WJgtIYm','','2026-08-07 19:10:02.973266','PATIENT'),(51,NULL,'1234567890','2015-03-04','arjav@gmail.com','arjav','Acro','$2a$10$FRpvYmyO0gAowr2dgzzC/.JEvxmZe4UudaEbxNwbRebfvAw8m4aIu',NULL,'2026-08-09 13:51:09.932590','DOCTOR'),(53,NULL,'1234567890','2026-08-13','hon@gmail.com','Hon','smith','$2a$10$fHhNmTbG/DfA149j9.UgPe0.7PfnchUjhPci1J2sipobNBaTmRaHq',NULL,'2026-08-10 08:31:38.536854','DOCTOR'),(54,'','1234567890','2004-12-27','walker@gmail.com','JohnWalker','walkin','$2a$10$oL.k9QfFFZjQFXuashADgeU2tvCEhX5nHDtA2p5p4AOWAgZz6FOKe','','2026-08-10 12:38:55.940694','PATIENT'),(55,'','9699588309','2002-07-17','vedantdesai1317@gmail.com','Vedant ','Desai','$2a$10$XLERmlku0Zca6JCIXdpAq..pClPm405G.xCpIOiQPOXNWICuGnWZm','','2026-08-10 16:59:25.208124','PATIENT');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-08 18:33:47
