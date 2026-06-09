# Integração Login e Cadastro - Death Music

## 📋 Setup Instructions

### 1. Configurar Banco de Dados MySQL


```sql
CREATE DATABASE death_music_db;
```

Execute o arquivo `criar_tabelas.php` para criar a tabela de usuários
- Abra no navegador: `http://localhost/death-music/cadastro e login/criar_tabelas.php`

### 2. Configurar arquivo `config.php`

Edite o arquivo `config.php` com suas credenciais MySQL:

```php
$servername = "localhost";
$username = "root";      // seu usuário MySQL
$password = "";          // sua senha MySQL
$database = "death_music_db";
```

### 3. Arquivos Criados

| Arquivo | Função |
|---------|--------|
| `config.php` | Configuração de conexão com o banco |
| `criar_tabelas.php` | Cria a tabela `usuarios` |
| `cadastro.php` | Backend para registro de novos usuários |
| `login.php` | Backend para validação de login |
| `cadastro.html` | Frontend de cadastro |
| `login.html` | Frontend de login |

### 4. Tabela de Usuários

A tabela `usuarios` foi criada com os seguintes campos:

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Fluxo de Funcionamento

**Cadastro:**
1. Usuário preenche formulário (Nome, Email, Senha)
2. JavaScript envia dados via fetch para `cadastro.php`
3. `cadastro.php` valida e insere usuário na tabela
4. Após sucesso, redireciona para login

**Login:**
1. Usuário preenche formulário (Email, Senha)
2. JavaScript envia dados via fetch para `login.php`
3. `login.php` valida credenciais contra a tabela
4. Após sucesso, inicia sessão e redireciona para `musicas.html`

### 6. Recursos de Segurança

✅ Senhas criptografadas com `password_hash()`
✅ Validação de email duplicado
✅ SQL injection protection com `real_escape_string()`
✅ Validação de comprimento mínimo de senha (6 caracteres)
✅ Session management para controlar acesso

### 7. Links Úteis

- Login → Cadastro: Link "Cadastre-se aqui" no formulário de login
- Cadastro → Login: Link "Faça login aqui" no formulário de cadastro

