-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: bank
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
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `from_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_account_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_type` enum('debit','credit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_from_account` (`from_account_no`),
  KEY `idx_to_account` (`to_account_no`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'0123456789012345','9999999999999999',30.00,'debit','Course payment to LMS','2025-11-27 19:52:15'),(2,'9999999999999999','1234567890123458',15.00,'credit','Course revenue share (50%)','2025-11-27 19:52:15'),(3,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-11-27 19:53:23'),(4,'9999999999999999','1234567890123459',5.00,'credit','Course revenue share (50%)','2025-11-27 19:53:23'),(5,'0123456789012346','9999999999999999',15.00,'debit','Course payment to LMS','2025-11-27 19:54:49'),(6,'9999999999999999','1234567890123459',7.50,'credit','Course revenue share (50%)','2025-11-27 19:54:49'),(7,'0123456789012346','9999999999999999',10.00,'debit','Course payment to LMS','2025-11-27 19:54:54'),(8,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-11-27 19:54:54'),(9,'0123456789012345','9999999999999999',10.00,'debit','Course payment to LMS','2025-11-27 20:06:01'),(10,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-11-27 20:06:01'),(11,'0123456789012347','9999999999999999',30.00,'debit','Course payment to LMS','2025-11-28 08:38:16'),(12,'9999999999999999','1234567890123458',15.00,'credit','Course revenue share (50%)','2025-11-28 08:38:16'),(13,'0123456789012345','9999999999999999',15.00,'debit','Course payment to LMS','2025-11-28 08:58:58'),(14,'9999999999999999','1234567890123459',7.50,'credit','Course revenue share (50%)','2025-11-28 08:58:58'),(15,'0123456789012347','9999999999999999',30.00,'debit','Course payment to LMS','2025-12-07 20:04:33'),(16,'9999999999999999','1234567890123458',15.00,'credit','Course revenue share (50%)','2025-12-07 20:04:33'),(17,'0123456789012345','9999999999999999',30.00,'debit','Course payment to LMS','2025-12-07 20:42:25'),(18,'9999999999999999','1234567890123458',15.00,'credit','Course revenue share (50%)','2025-12-07 20:42:25'),(19,'0123456789012345','9999999999999999',1.00,'debit','Course payment to LMS','2025-12-07 20:53:11'),(20,'9999999999999999','1234567890123458',0.50,'credit','Course revenue share (50%)','2025-12-07 20:53:11'),(21,'0123456789012346','9999999999999999',20.00,'debit','Course payment to LMS','2025-12-07 20:55:50'),(22,'9999999999999999','1234567890123458',10.00,'credit','Course revenue share (50%)','2025-12-07 20:55:50'),(23,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-07 21:24:41'),(24,'9999999999999999','1234567890123459',5.00,'credit','Course revenue share (50%)','2025-12-07 21:24:41'),(25,'0123456789012347','9999999999999999',1.00,'debit','Course payment to LMS','2025-12-07 21:25:30'),(26,'9999999999999999','1234567890123458',0.50,'credit','Course revenue share (50%)','2025-12-07 21:25:30'),(27,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-07 21:25:52'),(28,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-12-07 21:25:52'),(29,'0123456789012347','9999999999999999',20.00,'debit','Course payment to LMS','2025-12-07 21:26:05'),(30,'9999999999999999','1234567890123458',10.00,'credit','Course revenue share (50%)','2025-12-07 21:26:05'),(31,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-07 21:55:29'),(32,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-12-07 21:55:29'),(33,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-07 21:55:33'),(34,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-12-07 21:55:33'),(35,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-08 07:13:07'),(36,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-12-08 07:13:07'),(37,'0123456789012345','9999999999999999',10.00,'debit','Course payment to LMS','2025-12-10 14:57:12'),(38,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2025-12-10 14:57:12'),(39,'0123456789012347','9999999999999999',10.00,'debit','Course payment to LMS','2026-01-15 14:16:46'),(40,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2026-01-15 14:16:46'),(41,'0123456789012346','9999999999999999',10.00,'debit','Course payment to LMS','2026-01-15 15:17:02'),(42,'9999999999999999','1234567890123458',5.00,'credit','Course revenue share (50%)','2026-01-15 15:17:02'),(43,'0123456789012345','9999999999999999',10.00,'debit','Course payment to LMS','2026-02-27 09:23:31'),(44,'9999999999999999','1234567890123459',5.00,'credit','Course revenue share (50%)','2026-02-27 09:23:31');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_no` char(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret_key` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `account_no` (`account_no`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rehan','0123456789012345','458721',94.00),(2,'Tarit','0123456789012346','932145',145.00),(3,'Hadis','0123456789012347','932145',49.00),(4,'LMS','9999999999999999','932145',156.00),(5,'AHM','1234567890123458','741236',126.00),(6,'IZ','1234567890123459','456468',30.00),(8,'SS','1234567890123460','123455',0.00),(9,'MM','1234567890123461','123456',0.00);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 15:59:24
