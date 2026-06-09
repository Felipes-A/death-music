<?php
include 'config.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $conn->real_escape_string($_POST['nome']);
    $email = $conn->real_escape_string($_POST['email']);
    $senha = $_POST['senha'];

    // Validações
    if (empty($nome) || empty($email) || empty($senha)) {
        $response['success'] = false;
        $response['message'] = "Todos os campos são obrigatórios!";
    } else if (strlen($senha) < 6) {
        $response['success'] = false;
        $response['message'] = "A senha deve ter no mínimo 6 caracteres!";
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['success'] = false;
        $response['message'] = "Email inválido!";
    } else {
        // Verificar se email já existe
        $check_email = $conn->query("SELECT id FROM usuarios WHERE email = '$email'");
        
        if ($check_email->num_rows > 0) {
            $response['success'] = false;
            $response['message'] = "Este email já está cadastrado!";
        } else {
            // Hash da senha
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            
            // Inserir novo usuário
            $sql = "INSERT INTO usuarios (nome, email, senha) VALUES ('$nome', '$email', '$senha_hash')";
            
            if ($conn->query($sql) === TRUE) {
                $response['success'] = true;
                $response['message'] = "Cadastro realizado com sucesso! Você será redirecionado para login.";
            } else {
                $response['success'] = false;
                $response['message'] = "Erro ao cadastrar: " . $conn->error;
            }
        }
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
