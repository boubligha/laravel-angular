<?php

// Database configuration (same as in your .env file)
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'platforme_collaboration';

// Create connection to MySQL (without database)
$conn = new mysqli($host, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS $database";
if ($conn->query($sql) === TRUE) {
    echo "Database '$database' created successfully or already exists<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Close the connection
$conn->close();

echo "You can now run: <br>";
echo "1. php artisan migrate<br>";
echo "2. php artisan serve<br>";
echo "to set up your database and start your Laravel application.";