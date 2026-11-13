const form = document.querySelector('form');
const message = document.getElementById('auth-message');
const isRegistration = Boolean(document.getElementById('nome'));

const showMessage = (text, isError = false) => {
    message.textContent = text;
    message.hidden = false;
    message.style.color = isError ? '#b00020' : '#0d6b3d';
};

form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById(isRegistration ? 'senha' : 'password');
    const password = passwordInput.value;
    const body = { email, password };

    if (isRegistration) body.name = document.getElementById('nome').value.trim();

    try {
        const response = await fetch(`/api/auth/${isRegistration ? 'register' : 'login'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const result = await response.json();

        if (!response.ok) {
            showMessage(result.error || 'Não foi possível acessar sua conta.', true);
            return;
        }

        showMessage(isRegistration ? 'Cadastro realizado! Redirecionando...' : 'Login realizado! Redirecionando...');
        window.location.href = '../Death-music lobby.html';
    } catch (error) {
        console.error('Falha ao falar com o servidor.', error);
        showMessage('Não foi possível conectar ao servidor. Verifique se ele está rodando.', true);
    }
});
