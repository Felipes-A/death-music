const botoes = document.querySelectorAll('.botaoPlay');
const audios = document.querySelectorAll('.musica');

botoes.forEach((botao, index) => {
    const musica = audios[index];

    if (!musica) return;

    botao.addEventListener('click', () => {
        if (!musica.paused) {
            musica.pause();
            botao.textContent = '▶ Tocar música';
            return;
        }

        audios.forEach((audio, audioIndex) => {
            if (audioIndex !== index) {
                audio.pause();
                botoes[audioIndex].textContent = '▶ Tocar música';
            }
        });

        musica.play().catch(() => {
            botao.textContent = '▶ Tocar música';
        });
        botao.textContent = '⏸ Pausar';
    });
});