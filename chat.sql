CREATE DATABASE IF NOT EXISTS chat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chat;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `state` VARCHAR(20) DEFAULT 'offline'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `userid` INT NOT NULL,
  `friendid` INT NOT NULL,
  PRIMARY KEY (`userid`, `friendid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `allgroup`;
CREATE TABLE `allgroup` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `groupname` VARCHAR(50) NOT NULL,
  `groupdesc` VARCHAR(200) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser` (
  `groupid` INT NOT NULL,
  `userid` INT NOT NULL,
  `grouprole` VARCHAR(20) DEFAULT 'normal',
  PRIMARY KEY (`groupid`, `userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `offline_message`;
CREATE TABLE `offline_message` (
  `userid` INT NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  KEY `idx_userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert a test user for benchmark script
INSERT IGNORE INTO `user` (`id`, `name`, `password`, `state`) VALUES (1000, 'test0', '123', 'offline');
