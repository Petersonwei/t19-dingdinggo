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

        // check user data in the database
        $sql = "SELECT * FROM Users WHERE email = :email";
        $statement = $connection->prepare($sql);

        // bind parameter
        $statement->bindParam(':email', $email);

        // execute the query
        $statement->execute();

        // fetch user
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            echo "User successfully logged in.";
        } else {
            echo "Error: Invalid email or password.";
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
    <title>Log In To Brisbane's Best Events</title>
    <link rel="stylesheet" href="styles/login-styles.css">
</head>
<body>
    <div class="container">
        <div class="logo">LOGO</div>
        <h1>Log In To Brisbane's Best Events</h1>
        <form method="POST" action="">
            <input type="email" name="email" placeholder="Enter your email" required>
            <input type="password" name="password" placeholder="Password" required>
            <a href="#" class="forgot-password">Forgot Password</a>
            <button type="submit" class="btn-primary">Log in</button>
        </form>
        <div class="social-login">
            <p>- or authorise with -</p>
            <div class="social-icons">
                <img src="google-icon.png" alt="Google">
                <img src="facebook-icon.png" alt="Facebook">
            </div>
        </div>
    </div>
</body>
</html>