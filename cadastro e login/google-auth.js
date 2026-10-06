const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const setGoogleAuthStatus = (message) => {
    const status = document.getElementById('google-auth-status');
    if (status) status.textContent = message;
};

function handleGoogleCredentialResponse(response) {
    if (!response?.credential) {
        setGoogleAuthStatus('O Google não retornou uma credencial. Tente novamente.');
        return;
    }

    setGoogleAuthStatus('Credencial recebida. Para concluir o cadastro com segurança, o aplicativo precisa validá-la em um servidor.');
}

function initializeGoogleSignIn() {
    const button = document.getElementById('google-signin-button');
    if (!button) return;

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
        setGoogleAuthStatus('O login com Google ainda não está configurado. Adicione um Client ID válido do Google ao arquivo google-auth.js.');
        return;
    }

    if (!window.google?.accounts?.id) {
        setGoogleAuthStatus('Não foi possível carregar o serviço do Google. Confira sua conexão e tente novamente.');
        return;
    }

    try {
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
        });

        window.google.accounts.id.renderButton(button, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 320,
        });

        setGoogleAuthStatus('');
    } catch (error) {
        setGoogleAuthStatus('Não foi possível iniciar o login com Google. Confira o Client ID e as origens autorizadas.');
        console.error('Falha ao iniciar o login com Google.', error);
    }
}

const googleScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');

if (window.google?.accounts?.id) {
    initializeGoogleSignIn();
} else if (googleScript) {
    googleScript.addEventListener('load', initializeGoogleSignIn, { once: true });
    googleScript.addEventListener('error', () => {
        setGoogleAuthStatus('Não foi possível carregar o serviço do Google. Confira sua conexão e tente novamente.');
    }, { once: true });
} else {
    setGoogleAuthStatus('O serviço do Google não foi incluído nesta página.');
}