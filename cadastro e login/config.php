<?php
// Database connection configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "death_music_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8");
?>
