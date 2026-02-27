USE chat;
DELIMITER $$
CREATE PROCEDURE InsertTestUsers()
BEGIN
    DECLARE i INT DEFAULT 1000;
    WHILE i <= 1100 DO
        INSERT IGNORE INTO user (id, name, password, state) VALUES (i, CONCAT('test', i), '123', 'offline');
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;
CALL InsertTestUsers();
DROP PROCEDURE InsertTestUsers;
