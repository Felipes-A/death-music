function handleGoogleCredentialResponse(response) {
    console.log('Google ID token recebido:', response.credential);
    alert('Login com Google realizado com sucesso!\n(ID token impresso no console)');
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse,
        });

        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
            }
        );

        google.accounts.id.prompt();
    } else {
        console.warn('Google Identity Services não carregou corretamente.');
    }
});
