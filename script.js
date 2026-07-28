const elements = {
    add: document.getElementById('adicionar-playlist'),
    play: document.getElementById('play-playlist'),
    prev: document.getElementById('prev-track'),
    next: document.getElementById('next-track'),
    list: document.getElementById('lista-playlist'),
    status: document.getElementById('playlist-status'),
};

const addEmptyPlayerButton = document.getElementById('add-empty-player');
const cardsContainer = document.querySelector('.cards-container');

const tracks = Array.from(document.querySelectorAll('.player-container'))
    .filter((container) => container.querySelector('audio source'))
    .map((container) => ({
        title: container.querySelector('h2').textContent.trim(),
        artist: container.querySelector('.artista').textContent.trim(),
        src: container.querySelector('audio source').src,
        audio: container.querySelector('audio'),
        button: container.querySelector('.botaoPlay'),
        progressBar: container.querySelector('.track-progress'),
        progressFilled: container.querySelector('.track-progress-filled'),
        currentTimeElement: container.querySelector('.current-time'),
        durationTimeElement: container.querySelector('.duration-time'),
    }));

const playlistAudio = new Audio();
let playlist = [];
let currentIndex = 0;

const setText = (element, text) => element.textContent = text;
const hasPlaylist = () => playlist.length > 0;
const currentTrack = () => playlist[currentIndex];

const formatTime = (time) => {
    if (Number.isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const updateStatus = () => {
    if (!hasPlaylist()) {
        return setText(elements.status, 'Nenhuma música na playlist.');
    }

    const track = currentTrack();
    setText(elements.status, playlistAudio.paused
        ? `Pausado: ${track.title} — ${track.artist}`
        : `Tocando: ${track.title} — ${track.artist}`);
};

const pauseCards = () => tracks.forEach((track) => {
    track.audio.pause();
    setText(track.button, '▶ Tocar música');
});

const resetTrackProgress = (track) => {
    setText(track.currentTimeElement, '0:00');
    setText(track.durationTimeElement, '0:00');
    track.progressFilled.style.width = '0%';
};

const pausePlaylist = () => {
    playlistAudio.pause();
    setText(elements.play, '▶ Reproduzir playlist');
    updateStatus();
};

const renderPlaylist = () => {
    elements.list.innerHTML = '';

    if (!hasPlaylist()) {
        elements.list.innerHTML = '<li>A playlist está vazia.</li>';
        return updateStatus();
    }

    playlist.forEach((track, index) => {
        const item = document.createElement('li');
        item.className = index === currentIndex ? 'playlist-item active' : 'playlist-item';

        const label = document.createElement('span');
        label.textContent = `${track.title} — ${track.artist}`;
        label.addEventListener('click', () => playTrack(index));

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'playlist-delete';
        remove.textContent = 'Excluir';
        remove.addEventListener('click', (event) => {
            event.stopPropagation();
            removeFromPlaylist(index);
        });

        item.appendChild(label);
        item.appendChild(remove);
        elements.list.appendChild(item);
    });

    updateStatus();
};

const playTrack = (index) => {
    if (!hasPlaylist()) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    currentIndex = index;
    const track = currentTrack();

    pauseCards();
    playlistAudio.src = track.src;

    playlistAudio.play().catch(() => setText(elements.play, '▶ Reproduzir playlist'));
    setText(elements.play, '⏸ Pausar playlist');
    renderPlaylist();
};

const updateTrackProgress = (track) => {
    setText(track.currentTimeElement, formatTime(track.audio.currentTime));
    setText(track.durationTimeElement, formatTime(track.audio.duration));
    if (track.audio.duration > 0) {
        const percent = (track.audio.currentTime / track.audio.duration) * 100;
        track.progressFilled.style.width = `${percent}%`;
    }
};

const seekTrack = (track, event) => {
    const rect = track.progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    track.audio.currentTime = percent * track.audio.duration;
    updateTrackProgress(track);
};

const togglePlaylist = () => {
    if (!hasPlaylist()) return alert('Adicione músicas à playlist antes de reproduzir.');
    if (playlistAudio.paused) return playTrack(currentIndex);
    pausePlaylist();
};

const nextTrack = () => {
    if (!hasPlaylist()) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    playTrack(currentIndex);
};

const prevTrack = () => {
    if (!hasPlaylist()) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentIndex);
};

const removeFromPlaylist = (index) => {
    if (index < 0 || index >= playlist.length) return;

    playlist.splice(index, 1);
    if (!hasPlaylist()) {
        pausePlaylist();
        currentIndex = 0;
        return renderPlaylist();
    }

    if (currentIndex > index) currentIndex -= 1;
    if (currentIndex >= playlist.length) currentIndex = playlist.length - 1;
    if (!playlistAudio.paused) return playTrack(currentIndex);

    renderPlaylist();
};

const addTrackToPlaylist = (track) => {
    playlist.push(track);
    if (playlist.length === 1) currentIndex = 0;
    renderPlaylist();
    alert(`"${track.title}" adicionada à playlist.`);
};

const createEmptyPlayer = () => {
    const emptyPlayer = document.createElement('div');
    emptyPlayer.className = 'player-container empty-player';
    emptyPlayer.innerHTML = `
        <button class="delete-player-btn" type="button" aria-label="Excluir card">✕</button>
        <div class="empty-player-placeholder">
            <i class="fa-solid fa-music"></i>
            <h2></h2>
            <p class="artista">Sem música salva</p>
        </div>
        <div class="button-group">
            <button class="botaoPlay" disabled>▶ Tocar música</button>
        </div>
        <div class="progress-info">
            <span class="current-time">0:00</span>
            <span class="duration-time">0:00</span>
        </div>
        <div class="track-progress" role="button" tabindex="0" aria-label="Progresso da música">
            <div class="track-progress-filled"></div>
        </div>
    `;

    const deleteButton = emptyPlayer.querySelector('.delete-player-btn');
    deleteButton.addEventListener('click', () => emptyPlayer.remove());

    cardsContainer.appendChild(emptyPlayer);
    initializeCardCustomization(emptyPlayer);
};

const chooseTrack = () => {
    const options = tracks.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n');
    const choice = Number(prompt(`Escolha o número da música que deseja adicionar à playlist:\n${options}`)) - 1;

    if (!Number.isInteger(choice) || choice < 0 || choice >= tracks.length) {
        return alert('Escolha inválida. Tente novamente com um número válido.');
    }

    addTrackToPlaylist(tracks[choice]);
};

// Helper: convert rgb(...) to hex, returns null on failure
function rgbToHex(rgb) {
    if (!rgb) return null;
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
    return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

// Initialize customization UI for any existing cards on load
document.querySelectorAll('.player-container').forEach(initializeCardCustomization);

// Initialize customization UI for a single card element
function initializeCardCustomization(card) {
    if (!card || card.dataset.customInit) return;
    card.dataset.customInit = '1';

    const settingsBtn = document.createElement('button');
    settingsBtn.type = 'button';
    settingsBtn.className = 'card-settings-btn';
    settingsBtn.title = 'Configurar card';
    settingsBtn.textContent = '⚙';

    const panel = document.createElement('div');
    panel.className = 'card-settings-panel';
    panel.innerHTML = `
        <div class="settings-row"><label>Fundo: <input type="color" class="color-input bg-color"></label></div>
    `;

    card.appendChild(settingsBtn);
    card.appendChild(panel);

    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    const colorInput = panel.querySelector('.bg-color');
    if (colorInput) {
        colorInput.addEventListener('input', () => {
            card.style.backgroundColor = colorInput.value;
        });
    }

    // initialize inputs from computed styles
    try {
        const computed = getComputedStyle(card);
        const bgVal = rgbToHex(computed.backgroundColor) || '#4b4b4b';
        const bgInput = panel.querySelector('.bg-color');
        if (bgInput) bgInput.value = bgVal;
    } catch (e) {
        // ignore
    }

    // close panel when clicking outside
    document.addEventListener('click', (evt) => {
        if (!panel.contains(evt.target) && evt.target !== settingsBtn) panel.classList.remove('open');
    });
}

tracks.forEach((track) => {
    const resetElements = () => {
        setText(track.currentTimeElement, '0:00');
        setText(track.durationTimeElement, formatTime(track.audio.duration));
        track.progressFilled.style.width = '0%';
    };

    track.audio.addEventListener('ended', () => {
        setText(track.button, '▶ Tocar música');
        resetElements();
    });
});

tracks.forEach((track) => {
    const addButton = document.createElement('button');
    addButton.className = 'btn-add-playlist';
    addButton.type = 'button';
    addButton.textContent = '+ Playlist';
    addButton.addEventListener('click', () => addTrackToPlaylist(track));
    track.button.parentElement.appendChild(addButton);

    track.audio.addEventListener('loadedmetadata', () => {
        setText(track.durationTimeElement, formatTime(track.audio.duration));
    });

    track.audio.addEventListener('timeupdate', () => updateTrackProgress(track));
    track.audio.addEventListener('ended', () => {
        setText(track.button, '▶ Tocar música');
    });

    track.progressBar.addEventListener('click', (event) => {
        if (track.audio.duration > 0) seekTrack(track, event);
    });

    track.button.addEventListener('click', () => {
        if (!track.audio.paused) {
            track.audio.pause();
            return setText(track.button, '▶ Tocar música');
        }

        pausePlaylist();
        pauseCards();

        track.audio.play().catch(() => setText(track.button, '▶ Tocar música'));
        setText(track.button, '⏸ Pausar');
    });
});

elements.add.addEventListener('click', chooseTrack);
elements.play.addEventListener('click', togglePlaylist);
elements.prev.addEventListener('click', prevTrack);
elements.next.addEventListener('click', nextTrack);
addEmptyPlayerButton.addEventListener('click', createEmptyPlayer);

renderPlaylist();