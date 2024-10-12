<?php
// settings
$username = 'root';
$password = '7b5ef0801b4c67a493bbbeb4';
$dsn = "mysql:host=localhost;dbname=DingDingGo";

try {
    // connection
    $connection = new PDO($dsn, $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sqlUsers = "
        CREATE TABLE IF NOT EXISTS Users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL, 
            profile_image VARCHAR(2083)     
        );
    ";
    $connection->exec($sqlUsers);

    // 
    $sqlFriends = "
        CREATE TABLE IF NOT EXISTS Friends (
            friendship_id INT AUTO_INCREMENT PRIMARY KEY,   
            user_id_1 INT,                                 
            user_id_2 INT,                                  
            FOREIGN KEY (user_id_1) REFERENCES Users(user_id),
            FOREIGN KEY (user_id_2) REFERENCES Users(user_id)
        );
    ";
    $connection->exec($sqlFriends);

    // 
    $sqlInvitations = "
        CREATE TABLE IF NOT EXISTS Invitations (
            invitation_id INT AUTO_INCREMENT PRIMARY KEY,   
            event_id varchar(50),                          
            invited_user_id INT,    
            inviter_user_id INT,          
            invitation_event_id INT,               
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
            FOREIGN KEY (event_id) REFERENCES Events(event_id),
            FOREIGN KEY (invited_user_id) REFERENCES Users(user_id),
            FOREIGN KEY (inviter_user_id) REFERENCES Users(user_id)
        );
    ";
    $connection->exec($sqlInvitations);

    echo "create successfully";

} catch (PDOException $e) {
    echo "fail to operation: " . $e->getMessage();
}
?>