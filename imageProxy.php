<?php
// Get the image URL from the query string
if (isset($_GET['url'])) {
    $imageUrl = $_GET['url'];

    // Initialize a cURL session
    $ch = curl_init($imageUrl);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    // Execute the cURL session
    $imageData = curl_exec($ch);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

    // Close the cURL session
    curl_close($ch);

    // Set the appropriate content type and return the image data
    header("Content-Type: $contentType");
    echo $imageData;
} else {
    // If no URL is provided, return an error
    header('HTTP/1.1 400 Bad Request');
    echo 'Error: No URL provided.';
}
?>
