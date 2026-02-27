-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: course_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `cid` bigint NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT '0.00',
  `instructor_id` bigint NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`tid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (17,'Data Structure','Learn Data Structure',10.00,2),(18,'DBMS','Database',15.00,3),(19,'Computer Acrhitechture','seg',10.00,3),(20,'Theory of Computation','adfk adfkjl',30.00,2),(21,'Web Technologies','learn web tech',30.00,2),(22,'Microprocessor','micro',10.00,2),(23,'Database','database',10.00,3),(25,'Data Structure','fjaldkf fkadjf kldsfj ;aoiprklfjalskf dsjfklas kljdsfa',10.00,4),(26,'C programming','dklfjafj dkfjalkf jdjksfjal',10.00,4),(27,'Literature','adsjfa dsfjalfja',10.00,4),(28,'Test Quiz Course','A course to test quizzes',10.00,2),(29,'Test Quiz Course','A course to test quizzes',10.00,2),(30,'Test 3','djfa dasjfal',1.00,4),(34,'Operating system','this course will teach students operating systems',20.00,2);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_lecture`
--

DROP TABLE IF EXISTS `course_lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_lecture` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint NOT NULL,
  `lecture_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_path` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_mime` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_size` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_lecture` (`course_id`,`lecture_number`),
  CONSTRAINT `fk_lecture_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`cid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_lecture`
--

LOCK TABLES `course_lecture` WRITE;
/*!40000 ALTER TABLE `course_lecture` DISABLE KEYS */;
INSERT INTO `course_lecture` VALUES (7,17,1,'Lecture 1','/uploads/videos/1764066765384-194735087.mp4','snapsave-app_778986108505475_hd.mp4','video/mp4',5038148,'2025-11-25 16:32:45'),(8,17,2,'Lecture 2','/uploads/videos/1764066765397-757909584.mp4','snapsave-app_1225900576015944_hd.mp4','video/mp4',2078260,'2025-11-25 16:32:45'),(9,18,1,'Lecture 1','/uploads/videos/1764067338412-387253569.mp4','The 1975 - About You (Official).mp4','video/mp4',6618614,'2025-11-25 16:42:18'),(10,18,2,'Lecture 2','/uploads/videos/1764067338427-221712234.mp4','snapsave-app_778986108505475_hd.mp4','video/mp4',5038148,'2025-11-25 16:42:18'),(11,18,3,'Lecture 3','/uploads/videos/1764067338437-260486077.mp4','snapsave-app_1225900576015944_hd.mp4','video/mp4',2078260,'2025-11-25 16:42:18'),(12,19,1,'foreplay','/uploads/videos/1764068505156-617651120.mp4','snapsave-app_778986108505475_hd.mp4','video/mp4',5038148,'2025-11-25 17:01:45'),(13,19,2,'actual segs','/uploads/videos/1764068505279-151376627.mp4','snapsave-app_1225900576015944_hd.mp4','video/mp4',2078260,'2025-11-25 17:01:45'),(14,20,1,'lec 1','/uploads/videos/1764102817952-784615854.mp4','The 1975 - About You (Official).mp4','video/mp4',6618614,'2025-11-26 02:33:38'),(15,20,2,'lec 2','/uploads/videos/1764102817988-138647507.mp4','snapsave-app_778986108505475_hd.mp4','video/mp4',5038148,'2025-11-26 02:33:38'),(16,21,1,'lecture 1','/uploads/videos/1765137771794-501042632.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:02:51'),(17,21,2,'lecture 2','/uploads/videos/1765137771801-26715207.mp4','siimipie_1764936119_3780880122560824404_69770313028.mp4','video/mp4',3243337,'2025-12-08 02:02:51'),(18,21,3,'lecture 3','/uploads/videos/1765137771810-515444045.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:02:51'),(19,22,1,'Lecture 1','/uploads/videos/1765138028336-270883592.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:07:08'),(20,23,1,'lec 1','/uploads/videos/1765139221749-161948413.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:27:01'),(22,25,1,'lecture 1','/uploads/videos/1765139644253-221111199.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:34:04'),(23,26,1,'dsfaf dsfa','/uploads/videos/1765139716447-290623299.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:35:16'),(24,27,1,'lecture 1','/uploads/videos/1765140447805-936445112.mp4','siimipie_1764939282_3780906920304632416_69770313028.mp4','video/mp4',1604718,'2025-12-08 02:47:27'),(25,28,1,'Test Lecture 1','/uploads/videos/1765140575943-635300099.mp4','1764063498275-252725432.mp4','application/octet-stream',2078260,'2025-12-08 02:49:35'),(26,29,1,'Test Lecture 1','/uploads/videos/1765140590838-777208638.mp4','1764063498275-252725432.mp4','application/octet-stream',2078260,'2025-12-08 02:49:50'),(27,30,1,'dasfa ','/uploads/videos/1765140772405-114391635.mp4','siimipie_1764936119_3780880122560824404_69770313028.mp4','video/mp4',3243337,'2025-12-08 02:52:52'),(34,34,1,'Introduction to process','/uploads/videos/1772185552091-99739145.mp4','1764063498248-963049358.mp4','video/mp4',196341,'2026-02-27 15:45:52'),(35,34,2,'Deadlock','/uploads/videos/1772185552101-425426917.mp4','1764063498275-252725432.mp4','video/mp4',478382,'2026-02-27 15:45:52');
/*!40000 ALTER TABLE `course_lecture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_manifest`
--

DROP TABLE IF EXISTS `course_manifest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_manifest` (
  `course_id` bigint NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `stored_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  CONSTRAINT `fk_manifest_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`cid`) ON DELETE CASCADE,
  CONSTRAINT `course_manifest_chk_1` CHECK (json_valid(`payload`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_manifest`
--

LOCK TABLES `course_manifest` WRITE;
/*!40000 ALTER TABLE `course_manifest` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_manifest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_material`
--

DROP TABLE IF EXISTS `course_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_material` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `material_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_material_lecture` (`lecture_id`),
  CONSTRAINT `fk_material_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `course_lecture` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_material`
--

LOCK TABLES `course_material` WRITE;
/*!40000 ALTER TABLE `course_material` DISABLE KEYS */;
INSERT INTO `course_material` VALUES (7,7,'image/png','/uploads/materials/1764066765394-585411010.png','wallhaven-d6j79o.png','2025-11-25 16:32:45'),(8,8,'image/png','/uploads/materials/1764066765401-759763549.png','Generated Image November 15, 2025 - 5_30AM.png','2025-11-25 16:32:45'),(9,9,'application/pdf','/uploads/materials/1764067338427-370886803.pdf','API-Project_251121_080310.pdf','2025-11-25 16:42:18'),(10,10,'application/pdf','/uploads/materials/1764067338435-928858941.pdf','Chapter1.pdf','2025-11-25 16:42:18'),(11,11,'image/jpeg','/uploads/materials/1764067338443-763245752.jpg','pple-carplay-ios-26-4000x2182-23294.jpg','2025-11-25 16:42:18'),(12,12,'image/jpeg','/uploads/materials/1764068505166-811005303.jpg','macos-tahoe-26-5k-6016x6016-22672.jpg','2025-11-25 17:01:45'),(13,12,'application/pdf','/uploads/materials/1764068505180-4232921.pdf','Chapter1.pdf','2025-11-25 17:01:45'),(14,12,'application/zip','/uploads/materials/1764068505181-33495280.zip','LMS.zip','2025-11-25 17:01:45'),(15,13,'image/png','/uploads/materials/1764068505282-587432232.png','wallhaven-d6j79o.png','2025-11-25 17:01:45'),(16,14,'image/png','/uploads/materials/1764102817976-899334832.png','Generated Image November 15, 2025 - 5_30AM.png','2025-11-26 02:33:38'),(17,14,'image/jpeg','/uploads/materials/1764102817981-326488434.jpg','ios-26-apple-4000x2182-23300.jpg','2025-11-26 02:33:38'),(18,15,'image/png','/uploads/materials/1764102817998-46077309.png','wallhaven-d6j79o.png','2025-11-26 02:33:38'),(19,16,'image/png','/uploads/materials/1765137771800-890363769.png','screenshot-2025-11-29_23-27-22.png','2025-12-08 02:02:51'),(20,17,'image/png','/uploads/materials/1765137771809-560181429.png','screenshot-2025-11-18_17-13-27.png','2025-12-08 02:02:51'),(21,18,'image/png','/uploads/materials/1765137771814-346755186.png','screenshot-2025-11-29_23-16-07.png','2025-12-08 02:02:51'),(22,18,'image/png','/uploads/materials/1765137771814-349755706.png','screenshot-2025-11-29_23-16-32.png','2025-12-08 02:02:51'),(23,19,'image/png','/uploads/materials/1765138028340-677665316.png','screenshot-2025-11-18_17-13-27.png','2025-12-08 02:07:08'),(24,20,'image/png','/uploads/materials/1765139221754-219372002.png','screenshot-2025-11-18_17-12-41.png','2025-12-08 02:27:01'),(25,23,'image/png','/uploads/materials/1765139716456-884814577.png','screenshot-2025-11-29_23-16-07.png','2025-12-08 02:35:16'),(26,24,'image/jpeg','/uploads/materials/1765140447811-858924009.jpg','593994933_1293442199486722_3650094607633321443_n.jpg','2025-12-08 02:47:27'),(31,35,'application/pdf','/uploads/materials/1772185552108-721728421.pdf','1764068505180-4232921.pdf','2026-02-27 15:45:52');
/*!40000 ALTER TABLE `course_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `eid` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `enrollment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `tid` bigint DEFAULT NULL,
  PRIMARY KEY (`eid`),
  UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`uid`) ON DELETE CASCADE,
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`cid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (1,5,20,'2025-11-28 01:52:15',NULL),(2,7,19,'2025-11-28 01:53:23',NULL),(3,6,18,'2025-11-28 01:54:49',NULL),(4,6,17,'2025-11-28 01:54:54',NULL),(5,5,17,'2025-11-28 02:06:01',NULL),(6,7,20,'2025-11-28 14:38:16',NULL),(7,5,18,'2025-11-28 14:58:58',NULL),(8,7,21,'2025-12-08 02:04:33',NULL),(9,5,21,'2025-12-08 02:42:25',NULL),(10,5,30,'2025-12-08 02:53:11',NULL),(13,7,30,'2025-12-08 03:25:30',NULL),(14,7,27,'2025-12-08 03:25:52',NULL),(16,7,29,'2025-12-08 03:55:30',NULL),(17,7,28,'2025-12-08 03:55:33',NULL),(20,7,26,'2026-01-15 20:16:46',NULL),(21,6,25,'2026-01-15 21:17:02',NULL),(22,5,23,'2026-02-27 15:23:31',NULL);
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `tid` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_setup` tinyint(1) DEFAULT '0',
  `bank_acc_no` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_secret_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (2,'mish13','1234',1,'1234567890123458','741236'),(3,'iz','1234',1,'1234567890123459','456468'),(4,'ss','1234',1,'1234567890123458','456468'),(5,'mm','1234',1,'1236','123');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecture_quiz`
--

DROP TABLE IF EXISTS `lecture_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture_quiz` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_a` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_b` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_c` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_d` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct_answer` enum('A','B','C','D') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `lecture_quiz_ibfk_1` FOREIGN KEY (`lecture_id`) REFERENCES `course_lecture` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture_quiz`
--

LOCK TABLES `lecture_quiz` WRITE;
/*!40000 ALTER TABLE `lecture_quiz` DISABLE KEYS */;
INSERT INTO `lecture_quiz` VALUES (1,25,'What is 2+2?','3','4','5','6','B','2025-12-07 20:49:35'),(2,26,'What is 2+2?','3','4','5','6','B','2025-12-07 20:49:50'),(3,27,'dsfa','af','fddasf','dfsa','df','D','2025-12-07 20:52:52'),(12,34,'what\'s a process','a','b','c','d','B','2026-02-27 09:45:52'),(13,34,'what\'s burst time','a','b','c','d','A','2026-02-27 09:45:52'),(14,35,'what\'s deadlock','a','b','c','d','C','2026-02-27 09:45:52'),(15,35,'how to avoid deadlock','a','b','c','d','C','2026-02-27 09:45:52');
/*!40000 ALTER TABLE `lecture_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `uid` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_setup` tinyint(1) DEFAULT '0',
  `bank_acc_no` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_secret_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (4,'mehedi4','1234',0,NULL,NULL),(5,'rehan56','1234',1,'0123456789012346','458721'),(6,'tarti52','1234',1,'0123456789012346','932145'),(7,'hadis6','1234',1,'0123456789012347','932145');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_certificate`
--

DROP TABLE IF EXISTS `student_certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_certificate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `validation_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `percentage_score` decimal(5,2) NOT NULL,
  `issued_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `validation_code` (`validation_code`),
  UNIQUE KEY `uq_student_certificate` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `student_certificate_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`uid`) ON DELETE CASCADE,
  CONSTRAINT `student_certificate_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`cid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_certificate`
--

LOCK TABLES `student_certificate` WRITE;
/*!40000 ALTER TABLE `student_certificate` DISABLE KEYS */;
INSERT INTO `student_certificate` VALUES (1,5,30,'CERT-30-5-1765140815979',100.00,'2025-12-07 20:53:35'),(4,7,30,'CERT-30-7-1765144451540',100.00,'2025-12-07 21:54:11'),(5,7,28,'CERT-28-7-1765796984000',100.00,'2025-12-15 11:09:44');
/*!40000 ALTER TABLE `student_certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_course_score`
--

DROP TABLE IF EXISTS `student_course_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_course_score` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `total_quizzes` int NOT NULL DEFAULT '0',
  `correct_answers` int NOT NULL DEFAULT '0',
  `percentage_score` decimal(5,2) NOT NULL DEFAULT '0.00',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_course` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `student_course_score_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`uid`) ON DELETE CASCADE,
  CONSTRAINT `student_course_score_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`cid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_course_score`
--

LOCK TABLES `student_course_score` WRITE;
/*!40000 ALTER TABLE `student_course_score` DISABLE KEYS */;
INSERT INTO `student_course_score` VALUES (1,5,30,1,1,100.00,'2025-12-07 20:53:35'),(9,7,30,1,1,100.00,'2025-12-07 21:54:11'),(17,7,28,1,1,100.00,'2025-12-07 21:55:59');
/*!40000 ALTER TABLE `student_course_score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_lecture_progress`
--

DROP TABLE IF EXISTS `student_lecture_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_lecture_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `lecture_id` bigint NOT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_lecture` (`student_id`,`lecture_id`),
  KEY `lecture_id` (`lecture_id`),
  CONSTRAINT `student_lecture_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`uid`) ON DELETE CASCADE,
  CONSTRAINT `student_lecture_progress_ibfk_2` FOREIGN KEY (`lecture_id`) REFERENCES `course_lecture` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_lecture_progress`
--

LOCK TABLES `student_lecture_progress` WRITE;
/*!40000 ALTER TABLE `student_lecture_progress` DISABLE KEYS */;
INSERT INTO `student_lecture_progress` VALUES (1,5,27,0,NULL),(2,5,9,1,'2025-12-10 14:35:53'),(3,5,10,1,'2025-12-10 14:35:57'),(4,5,15,1,'2025-12-10 14:37:00'),(5,7,12,1,'2025-12-10 14:38:39'),(6,7,13,1,'2025-12-10 14:38:56'),(10,7,25,1,'2025-12-15 11:09:23'),(11,5,16,1,'2026-02-27 09:22:14'),(12,5,7,1,'2026-02-27 09:22:29'),(13,5,8,1,'2026-02-27 09:22:37');
/*!40000 ALTER TABLE `student_lecture_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_quiz_attempt`
--

DROP TABLE IF EXISTS `student_quiz_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_quiz_attempt` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `lecture_id` bigint NOT NULL,
  `quiz_id` bigint NOT NULL,
  `selected_answer` enum('A','B','C','D') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `attempted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `lecture_id` (`lecture_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `student_quiz_attempt_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`uid`) ON DELETE CASCADE,
  CONSTRAINT `student_quiz_attempt_ibfk_2` FOREIGN KEY (`lecture_id`) REFERENCES `course_lecture` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_quiz_attempt_ibfk_3` FOREIGN KEY (`quiz_id`) REFERENCES `lecture_quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_quiz_attempt`
--

LOCK TABLES `student_quiz_attempt` WRITE;
/*!40000 ALTER TABLE `student_quiz_attempt` DISABLE KEYS */;
INSERT INTO `student_quiz_attempt` VALUES (1,5,27,3,'D',1,'2025-12-07 20:53:35'),(23,7,27,3,'D',1,'2025-12-07 21:54:11'),(39,7,25,1,'B',1,'2025-12-15 11:09:43');
/*!40000 ALTER TABLE `student_quiz_attempt` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 15:59:06
