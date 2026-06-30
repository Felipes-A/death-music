const botoes = document.querySelectorAll('.botaoPlay');
const audios = document.querySelectorAll('.musica');
const adicionarPlaylistButton = document.getElementById('adicionar-playlist');
const playPlaylistButton = document.getElementById('play-playlist');
const prevTrackButton = document.getElementById('prev-track');
const nextTrackButton = document.getElementById('next-track');
const listaPlaylist = document.getElementById('lista-playlist');
const playlistStatus = document.getElementById('playlist-status');

const tracks = Array.from(document.querySelectorAll('.player-container')).map((container, index) => ({
    title: container.querySelector('h2').textContent.trim(),
    artist: container.querySelector('.artista').textContent.trim(),
    src: container.querySelector('audio source').src,
    cardAudio: container.querySelector('audio'),
    cardButton: container.querySelector('.botaoPlay'),
    container
}));

const playlistAudio = new Audio();
let playlist = [];
let currentPlaylistIndex = 0;

function adicionarMusicaPorIndex(index) {
    playlist.push(tracks[index]);
    if (playlist.length === 1) {
        currentPlaylistIndex = 0;
    }
    renderPlaylist();
    alert(`"${tracks[index].title}" adicionada à playlist.`);
}

tracks.forEach((track, index) => {
    const addButton = document.createElement('button');
    addButton.className = 'btn-add-playlist';
    addButton.type = 'button';
    addButton.textContent = '+ Playlist';
    addButton.addEventListener('click', () => adicionarMusicaPorIndex(index));
    const buttonGroup = track.cardButton.parentElement;
    buttonGroup.appendChild(addButton);
});

function pauseAllCardAudios() {
    tracks.forEach(track => {
        if (!track.cardAudio.paused) {
            track.cardAudio.pause();
            track.cardButton.textContent = '▶ Tocar música';
        }
    });
}

function pausePlaylistAudio() {
    if (!playlistAudio.paused) {
        playlistAudio.pause();
    }
    playPlaylistButton.textContent = '▶ Reproduzir playlist';
    updatePlaylistStatus();
}

function updatePlaylistStatus() {
    if (playlist.length === 0) {
        playlistStatus.textContent = 'Nenhuma música na playlist.';
        return;
    }

    const currentTrack = playlist[currentPlaylistIndex];
    if (playlistAudio.paused) {
        playlistStatus.textContent = `Pausado: ${currentTrack.title} — ${currentTrack.artist}`;
    } else {
        playlistStatus.textContent = `Tocando: ${currentTrack.title} — ${currentTrack.artist}`;
    }
}

function renderPlaylist() {
    listaPlaylist.innerHTML = '';

    if (playlist.length === 0) {
        const item = document.createElement('li');
        item.textContent = 'A playlist está vazia.';
        listaPlaylist.appendChild(item);
        updatePlaylistStatus();
        return;
    }

    playlist.forEach((track, index) => {
        const item = document.createElement('li');
        item.textContent = `${track.title} — ${track.artist}`;
        item.className = index === currentPlaylistIndex ? 'playlist-item active' : 'playlist-item';
        item.addEventListener('click', () => {
            currentPlaylistIndex = index;
            playCurrentPlaylistTrack();
        });
        listaPlaylist.appendChild(item);
    });

    updatePlaylistStatus();
}

function playCurrentPlaylistTrack() {
    if (playlist.length === 0) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    const track = playlist[currentPlaylistIndex];
    pauseAllCardAudios();

    if (playlistAudio.src !== track.src) {
        playlistAudio.src = track.src;
    }

    playlistAudio.play().catch(() => {
        playPlaylistButton.textContent = '▶ Reproduzir playlist';
    });
    playPlaylistButton.textContent = '⏸ Pausar playlist';
    renderPlaylist();
}

function togglePlaylistPlay() {
    if (playlistAudio.paused) {
        playCurrentPlaylistTrack();
        return;
    }

    playlistAudio.pause();
    playPlaylistButton.textContent = '▶ Reproduzir playlist';
    updatePlaylistStatus();
}

function playNextTrack() {
    if (playlist.length === 0) return;

    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    playCurrentPlaylistTrack();
}

function playPreviousTrack() {
    if (playlist.length === 0) return;

    currentPlaylistIndex = (currentPlaylistIndex - 1 + playlist.length) % playlist.length;
    playCurrentPlaylistTrack();
}

playlistAudio.addEventListener('ended', () => {
    if (playlist.length === 0) return;
    if (currentPlaylistIndex < playlist.length - 1) {
        currentPlaylistIndex += 1;
        playCurrentPlaylistTrack();
        return;
    }
    playlistAudio.pause();
    playPlaylistButton.textContent = '▶ Reproduzir playlist';
    updatePlaylistStatus();
});

function adicionarMusica() {
    const options = tracks.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n');
    const escolha = prompt(`Escolha o número da música que deseja adicionar à playlist:\n${options}`);
    const index = Number(escolha) - 1;

    if (!Number.isInteger(index) || index < 0 || index >= tracks.length) {
        alert('Escolha inválida. Tente novamente com um número válido.');
        return;
    }

    playlist.push(tracks[index]);
    if (playlist.length === 1) {
        currentPlaylistIndex = 0;
    }
    renderPlaylist();
    alert(`"${tracks[index].title}" foi adicionada à playlist.`);
}

botoes.forEach((botao, index) => {
    const musica = audios[index];

    if (!musica) return;

    botao.addEventListener('click', () => {
        if (!musica.paused) {
            musica.pause();
            botao.textContent = '▶ Tocar música';
            return;
        }

        playlistAudio.pause();
        playPlaylistButton.textContent = '▶ Reproduzir playlist';
        updatePlaylistStatus();

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

adicionarPlaylistButton.addEventListener('click', adicionarMusica);
playPlaylistButton.addEventListener('click', togglePlaylistPlay);
prevTrackButton.addEventListener('click', playPreviousTrack);
nextTrackButton.addEventListener('click', playNextTrack);
renderPlaylist();