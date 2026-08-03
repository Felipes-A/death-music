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
    `;
    emptyCard.querySelector('.delete-player-btn').addEventListener('click', () => emptyCard.remove());
    DOM.cardsContainer.appendChild(emptyCard);
});

trackData.forEach(createTrackCard);
renderPlaylist();
