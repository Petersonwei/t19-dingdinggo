<?php
// settings
$username = 'root';
$password = '7b5ef0801b4c67a493bbbeb4';
$dsn = "mysql:host=localhost;dbname=DingDingGo";

try {
    // connection
    $connection = new PDO($dsn, $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // check if form is submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // get email and password from POST request
        $email = $_POST['email'];
        $password = $_POST['password'];

        // hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // insert user data into database
        $sql = "INSERT INTO Users (email, password) VALUES (:email, :password)";
        $statement = $connection->prepare($sql);

        // bind parameters
        $statement->bindParam(':email', $email);
        $statement->bindParam(':password', $hashed_password);

        // execute the query
        if ($statement->execute()) {
            echo "User successfully registered.";
        } else {
            echo "Error: Unable to register.";
        }
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="styles/login-styles.css">
</head>
<body>
    <div class="container">
        <h1>Sign Up</h1>
        <form method="POST" action="">
            <input type="email" name="email" placeholder="Enter your email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" class="btn-primary">Sign up</button>
        </form>
    </div>
</body>
</html>