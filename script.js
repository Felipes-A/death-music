const DOM = {
    addTrackButton: document.getElementById('adicionar-playlist'),
    playButton: document.getElementById('play-playlist'),
    prevButton: document.getElementById('prev-track'),
    nextButton: document.getElementById('next-track'),
    playlistElement: document.getElementById('lista-playlist'),
    playlistStatus: document.getElementById('playlist-status'),
    addEmptyButton: document.getElementById('add-empty-player'),
    cardsContainer: document.querySelector('.cards-container'),
};

const trackData = [
    {
        title: 'DEVILS NEVER CRY',
        artist: 'スタッフロール',
        image: 'imagens/0x1900-000000-80-0-0.jpg',
        src: 'audio/Capcom Sound Team - DEVILS NEVER CRY (スタッフロール) (SPOTISAVER).mp3',
    },
    {
        title: 'Snot',
        artist: 'Stoopid',
        image: 'imagens/81nACACrssL._UF1000,1000_QL80_.jpg',
        src: 'audio/Snot - Stoopid (SPOTISAVER).mp3',
    },
    {
        title: 'Black Hole Sun',
        artist: 'Soundgarden',
        image: 'imagens/images.jpg',
        src: 'audio/Soundgarden - Black Hole Sun (SPOTISAVER).mp3',
    },
    {
        title: 'Nobody',
        artist: 'Skindred',
        image: 'imagens/0x1900-000000-80-0-0%20(1).jpg',
        src: 'audio/Skindred - Nobody (SPOTISAVER).mp3',
    },
];

const state = {
    playlist: [],
    index: 0,
    audio: new Audio(),
};

const cards = [];

const fileChooser = (() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    return input;
})();
let pendingDownloadCard = null;

const fmtTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = String(Math.floor(value % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const updateStatus = () => {
    if (!state.playlist.length) {
        DOM.playlistStatus.textContent = 'Nenhuma música na playlist.';
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        return;
    }

    const current = state.playlist[state.index];
    DOM.playlistStatus.textContent = state.audio.paused
        ? `Pausado: ${current.title} — ${current.artist}`
        : `Tocando: ${current.title} — ${current.artist}`;
};

const stopAllCards = () => cards.forEach((card) => {
    card.audio.pause();
    card.button.textContent = '▶ Tocar música';
});

const renderPlaylist = () => {
    DOM.playlistElement.innerHTML = state.playlist.length
        ? state.playlist.map((track, index) => `
            <li class="playlist-item${index === state.index ? ' active' : ''}">
                <span data-index="${index}">${track.title} — ${track.artist}</span>
                <button type="button" data-remove="${index}">Excluir</button>
            </li>`).join('')
        : '<li>A playlist está vazia.</li>';

    DOM.playlistElement.querySelectorAll('[data-index]').forEach((item) => {
        item.addEventListener('click', () => switchPlaylistTrack(Number(item.dataset.index)));
    });

    DOM.playlistElement.querySelectorAll('[data-remove]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            removeFromPlaylist(Number(button.dataset.remove));
        });
    });

    updateStatus();
};

const switchPlaylistTrack = (index) => {
    if (!state.playlist.length) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    state.index = index;
    const track = state.playlist[state.index];
    stopAllCards();
    state.audio.src = track.src;
    state.audio.play().catch(() => {});
    DOM.playButton.textContent = '⏸ Pausar playlist';
    renderPlaylist();
};

const togglePlaylist = () => {
    if (!state.playlist.length) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    if (state.audio.paused) {
        switchPlaylistTrack(state.index);
    } else {
        state.audio.pause();
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        updateStatus();
    }
};

const nextTrack = () => {
    if (!state.playlist.length) return;
    state.index = (state.index + 1) % state.playlist.length;
    switchPlaylistTrack(state.index);
};

const prevTrack = () => {
    if (!state.playlist.length) return;
    state.index = (state.index - 1 + state.playlist.length) % state.playlist.length;
    switchPlaylistTrack(state.index);
};

const addToPlaylist = (card) => {
    state.playlist.push(card);
    if (state.playlist.length === 1) state.index = 0;
    renderPlaylist();
    alert(`"${card.title}" adicionada à playlist.`);
};

const removeFromPlaylist = (index) => {
    if (index < 0 || index >= state.playlist.length) return;
    state.playlist.splice(index, 1);

    if (!state.playlist.length) {
        state.audio.pause();
        state.index = 0;
        renderPlaylist();
        return;
    }

    if (state.index > index) state.index -= 1;
    if (state.index >= state.playlist.length) state.index = state.playlist.length - 1;
    if (!state.audio.paused) switchPlaylistTrack(state.index);
    else renderPlaylist();
};

const createTrackCard = ({ title, artist, image, src }) => {
    const card = document.createElement('div');
    card.className = 'player-container';
    card.innerHTML = `
        <img src="${image}" alt="${title} album cover">
        <h2>${title}</h2>
        <p class="artista">${artist}</p>
        <div class="button-group">
            <button class="botaoPlay" type="button">▶ Tocar música</button>
            <button class="btn-add-playlist" type="button">+ Playlist</button>
            <audio class="musica" loop preload="none">
                <source src="${src}" type="audio/mpeg">
            </audio>
        </div>
        <div class="progress-info">
            <span class="current-time">0:00</span>
            <span class="duration-time">0:00</span>
        </div>
        <div class="track-progress" role="button" tabindex="0" aria-label="Progresso da música">
            <div class="track-progress-filled"></div>
        </div>
    `;

    const track = {
        title,
        artist,
        src,
        audio: card.querySelector('audio'),
        button: card.querySelector('.botaoPlay'),
        addButton: card.querySelector('.btn-add-playlist'),
        progressBar: card.querySelector('.track-progress'),
        progressFilled: card.querySelector('.track-progress-filled'),
        currentTime: card.querySelector('.current-time'),
        durationTime: card.querySelector('.duration-time'),
    };

    track.audio.addEventListener('loadedmetadata', () => {
        track.durationTime.textContent = fmtTime(track.audio.duration);
    });

    track.audio.addEventListener('timeupdate', () => {
        track.currentTime.textContent = fmtTime(track.audio.currentTime);
        if (track.audio.duration) {
            track.progressFilled.style.width = `${(track.audio.currentTime / track.audio.duration) * 100}%`;
        }
    });

    track.audio.addEventListener('ended', () => {
        track.button.textContent = '▶ Tocar música';
    });

    track.button.addEventListener('click', () => {
        if (!track.audio.paused) {
            track.audio.pause();
            track.button.textContent = '▶ Tocar música';
            return;
        }

        state.audio.pause();
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        stopAllCards();

        track.audio.play().catch(() => {});
        track.button.textContent = '⏸ Pausar';
    });

    track.addButton.addEventListener('click', () => addToPlaylist(track));

    track.progressBar.addEventListener('click', (event) => {
        if (!track.audio.duration) return;
        const rect = track.progressBar.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        track.audio.currentTime = percent * track.audio.duration;
    });

    DOM.cardsContainer.appendChild(card);
    cards.push(track);
};

const setupDownloadedMusic = (file, card) => {
    const title = file.name.replace(/\.[^/.]+$/, '');
    const artist = 'Download local';
    const trackTitle = card.querySelector('h2');
    const trackArtist = card.querySelector('.artista');
    const playButton = card.querySelector('.botaoPlay');
    const playlistButton = card.querySelector('.btn-add-playlist');
    const progressBar = card.querySelector('.track-progress');
    const progressFill = card.querySelector('.track-progress-filled');
    const currentTime = card.querySelector('.current-time');
    const durationTime = card.querySelector('.duration-time');
    const downloadBar = card.querySelector('.download-progress');
    const downloadFill = card.querySelector('.download-progress-filled');

    trackTitle.textContent = title;
    trackArtist.textContent = artist;
    playButton.disabled = false;
    playlistButton.disabled = false;

    const audio = document.createElement('audio');
    audio.loop = true;
    audio.preload = 'metadata';
    const source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = file.type;
    audio.appendChild(source);
    card.appendChild(audio);

    const track = {
        title,
        artist,
        src: source.src,
        audio,
        button: playButton,
        addButton: playlistButton,
        progressBar,
        progressFilled: progressFill,
        currentTime,
        durationTime,
    };

    audio.addEventListener('loadedmetadata', () => {
        durationTime.textContent = fmtTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        currentTime.textContent = fmtTime(audio.currentTime);
        if (audio.duration) {
            progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }
    });

    audio.addEventListener('ended', () => {
        playButton.textContent = '▶ Tocar música';
    });

    playButton.addEventListener('click', () => {
        if (!audio.paused) {
            audio.pause();
            playButton.textContent = '▶ Tocar música';
            return;
        }

        state.audio.pause();
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        stopAllCards();

        audio.play().catch(() => {});
        playButton.textContent = '⏸ Pausar';
    });

    playlistButton.addEventListener('click', () => addToPlaylist(track));

    progressBar.addEventListener('click', (event) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = percent * audio.duration;
    });

    cards.push(track);
    downloadBar.style.display = 'block';

    const reader = new FileReader();
    reader.onprogress = (event) => {
        if (!event.lengthComputable) return;
        downloadFill.style.width = `${Math.round((event.loaded / event.total) * 100)}%`;
    };
    reader.onloadend = () => {
        downloadFill.style.width = '100%';
        setTimeout(() => {
            downloadBar.style.display = 'none';
        }, 800);
    };
    reader.readAsArrayBuffer(file);
};

fileChooser.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
        alert('Selecione um arquivo de áudio válido.');
        fileChooser.value = '';
        return;
    }

    if (!pendingDownloadCard) return;
    setupDownloadedMusic(file, pendingDownloadCard);
    pendingDownloadCard = null;
    fileChooser.value = '';
});

DOM.addTrackButton.addEventListener('click', () => {
    const choice = Number(prompt(
        trackData.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n')
    )) - 1;

    if (!Number.isInteger(choice) || choice < 0 || choice >= cards.length) {
        alert('Escolha inválida. Tente novamente com um número válido.');
        return;
    }

    addToPlaylist(cards[choice]);
});

DOM.playButton.addEventListener('click', togglePlaylist);
DOM.prevButton.addEventListener('click', prevTrack);
DOM.nextButton.addEventListener('click', nextTrack);
DOM.addEmptyButton.addEventListener('click', () => {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'player-container empty-player';
    emptyCard.innerHTML = `
        <button class="delete-player-btn" type="button" aria-label="Excluir card">✕</button>
        <div class="empty-player-placeholder">
            <i class="fa-solid fa-music"></i>
            <h2>Sem música</h2>
            <p class="artista">Sem música salva</p>
        </div>
        <div class="button-group">
            <button class="botaoPlay" type="button" disabled>▶ Tocar música</button>
            <button class="btn-add-playlist" type="button" disabled>+ Playlist</button>
            <button class="btn-download" type="button">Adicionar download</button>
        </div>
        <div class="progress-info">
            <span class="current-time">0:00</span>
            <span class="duration-time">0:00</span>
        </div>
        <div class="track-progress" role="button" tabindex="0" aria-label="Progresso da música">
            <div class="track-progress-filled"></div>
        </div>
        <div class="download-progress" style="display:none; width:100%; height:8px; background:#444; margin-top:8px;">
            <div class="download-progress-filled" style="width:0%; height:100%; background:#2ecc71;"></div>
        </div>
    `;

    emptyCard.querySelector('.delete-player-btn').addEventListener('click', () => emptyCard.remove());
    emptyCard.querySelector('.btn-download').addEventListener('click', () => {
        pendingDownloadCard = emptyCard;
        fileChooser.click();
    });
    DOM.cardsContainer.appendChild(emptyCard);
});

trackData.forEach(createTrackCard);
renderPlaylist();
