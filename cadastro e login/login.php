<?php
session_start();
include 'config.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $conn->real_escape_string($_POST['email']);
    $senha = $_POST['password'];

    if (empty($email) || empty($senha)) {
        $response['success'] = false;
        $response['message'] = "Email e senha são obrigatórios!";
    } else {
        // Buscar usuário pelo email
        $sql = "SELECT id, nome, email, senha FROM usuarios WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result->num_rows == 1) {
            $usuario = $result->fetch_assoc();
            
            // Verificar senha
            if (password_verify($senha, $usuario['senha'])) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_email'] = $usuario['email'];
                
                $response['success'] = true;
                $response['message'] = "Login realizado com sucesso!";
                $response['redirect'] = "../musicas.html";
            } else {
                $response['success'] = false;
                $response['message'] = "Email ou senha incorretos!";
            }
        } else {
            $response['success'] = false;
            $response['message'] = "Email ou senha incorretos!";
        }
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
