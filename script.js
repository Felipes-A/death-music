const DOM = {
    addTrackButton: document.getElementById('adicionar-playlist'),
    playButton: document.getElementById('play-playlist'),
    prevButton: document.getElementById('prev-track'),
    nextButton: document.getElementById('next-track'),
    playlistElement: document.getElementById('lista-playlist'),
    playlistStatus: document.getElementById('playlist-status'),
    cardsContainer: document.querySelector('.cards-container'),
    searchInput: document.getElementById('search-input'),
    searchEmptyState: document.getElementById('search-empty-state'),
    authLink: document.querySelector('.auth-link'),
    profileButton: document.getElementById('profile-button'),
    profilePanel: document.getElementById('profile-panel'),
    profileName: document.getElementById('profile-name'),
    profileEmail: document.getElementById('profile-email'),
    profilePhotoButton: document.getElementById('profile-photo-button'),
    profilePhotoInput: document.getElementById('profile-photo-input'),
    profileAvatar: document.getElementById('profile-avatar'),
    profileAvatarFallback: document.getElementById('profile-avatar-fallback'),
    profilePanelAvatar: document.getElementById('profile-panel-avatar'),
    profilePanelAvatarFallback: document.getElementById('profile-panel-avatar-fallback'),
};

const trackData = [
    {
        title: 'DEVILS NEVER CRY',
        artist: 'スタッフロール',
        image: 'imagens/0x1900-000000-80-0-0.jpg',
        src: 'audio/Capcom Sound Team - DEVILS NEVER CRY (スタッフロール) (SPOTISAVER).mp3',
    },
    {
        title: 'Stoopid',
        artist: 'Snot',
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

const STORAGE_KEYS = {
    playlist: 'deathMusicPlaylist',
    profile: 'deathMusicProfile',
};

const state = {
    playlist: [],
    index: 0,
    authenticated: false,
    audio: new Audio(),
    profile: {
        name: 'Usuário',
        email: 'usuario@email.com',
        avatar: '',
    },
};

const cards = [];

const readStorage = (key, fallback = []) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (error) {
        console.warn(`Não foi possível ler ${key} do localStorage.`, error);
        return fallback;
    }
};

const writeStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Não foi possível salvar ${key} no localStorage.`, error);
    }
};

const apiRequest = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    });
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.error || 'Não foi possível concluir a solicitação.');
        error.status = response.status;
        throw error;
    }
    return result;
};

const loadSavedProfile = () => {
    const savedProfile = readStorage(STORAGE_KEYS.profile, null);
    if (savedProfile) {
        state.profile = {
            name: savedProfile.name || 'Usuário',
            email: savedProfile.email || 'usuario@email.com',
            avatar: savedProfile.avatar || '',
        };
    }
};

const saveProfile = async () => {
    if (!state.authenticated) {
        writeStorage(STORAGE_KEYS.profile, state.profile);
        return;
    }

    try {
        await apiRequest('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ avatar: state.profile.avatar }),
        });
    } catch (error) {
        alert(error.message);
    }
};

const loadSavedPlaylist = () => {
    const savedPlaylist = readStorage(STORAGE_KEYS.playlist, []);
    if (Array.isArray(savedPlaylist) && savedPlaylist.length) {
        state.playlist = savedPlaylist.map((track) => ({
            title: track.title,
            artist: track.artist,
            image: track.image || 'imagens/0x1900-000000-80-0-0.jpg',
            src: track.src,
        }));
    }
};

const savePlaylist = async () => {
    if (!state.authenticated) {
        writeStorage(STORAGE_KEYS.playlist, state.playlist);
        return;
    }

    try {
        await apiRequest('/api/playlist', {
            method: 'PUT',
            body: JSON.stringify({ playlist: state.playlist }),
        });
    } catch (error) {
        alert(error.message);
    }
};

const setAvatarState = (avatarUrl) => {
    const hasAvatar = Boolean(avatarUrl);
    const avatars = [
        [DOM.profileAvatar, DOM.profileAvatarFallback],
        [DOM.profilePanelAvatar, DOM.profilePanelAvatarFallback],
    ];

    avatars.forEach(([image, fallback]) => {
        if (!image) return;

        image.src = avatarUrl || '';
        image.hidden = !hasAvatar;
        image.style.display = hasAvatar ? 'block' : 'none';

        if (fallback) {
            fallback.hidden = hasAvatar;
            fallback.style.display = hasAvatar ? 'none' : 'flex';
        }
    });
};

const renderProfile = () => {
    if (DOM.profileName) DOM.profileName.textContent = state.profile.name;
    if (DOM.profileEmail) DOM.profileEmail.textContent = state.profile.email;
    setAvatarState(state.profile.avatar);
};

const toggleProfilePanel = () => {
    if (!DOM.profileButton || !DOM.profilePanel) return;

    const isHidden = DOM.profilePanel.hasAttribute('hidden');
    DOM.profilePanel.toggleAttribute('hidden', !isHidden);
    DOM.profileButton.setAttribute('aria-expanded', String(isHidden));
};

const updateProfileFromFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!file || !allowedTypes.includes(file.type) || file.size > 1500 * 1024) {
        alert('Selecione uma imagem PNG, JPEG, WebP ou GIF de até 1,5 MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        state.profile.avatar = String(event.target?.result || '');
        renderProfile();
        saveProfile();
    };
    reader.readAsDataURL(file);
};

const fmtTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = String(Math.floor(value % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const normalizeText = (value = '') =>
    value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const updateSearchFilter = () => {
    const query = normalizeText(DOM.searchInput?.value || '');
    let visible = 0;

    DOM.cardsContainer?.querySelectorAll('.player-container').forEach((card) => {
        const text = normalizeText(card.dataset.searchValue || card.textContent || '');
        const matches = !query || text.includes(query);
        card.classList.toggle('is-hidden', !matches);
        if (matches) visible += 1;
    });

    if (DOM.searchEmptyState) {
        DOM.searchEmptyState.classList.toggle('visible', !!query && visible === 0);
        DOM.searchEmptyState.textContent = 'Nenhuma música encontrada para esta busca.';
    }
};

const setPlayButtonState = (isPlaying) => {
    if (DOM.playButton) {
        DOM.playButton.textContent = isPlaying ? '⏸ play' : '▶ play';
    }
};

const updateStatus = () => {
    if (!state.playlist.length) {
        if (DOM.playlistStatus) DOM.playlistStatus.textContent = 'Nenhuma música na playlist.';
        state.audio.pause();
        state.audio.src = '';
        setPlayButtonState(false);
        return;
    }

    if (state.index < 0 || state.index >= state.playlist.length) {
        state.index = 0;
    }

    const track = state.playlist[state.index];
    const statusText = state.audio.paused ? 'Pausado' : 'Tocando';
    if (DOM.playlistStatus) {
        DOM.playlistStatus.textContent = `${statusText}: ${track.title} — ${track.artist}`;
    }
    setPlayButtonState(!state.audio.paused);
};

const stopAllCards = () => {
    cards.forEach(({ audio, button }) => {
        audio.pause();
        if (button) button.textContent = '▶ Tocar música';
    });
};

const bindAudioControls = ({ audio, button, progressBar, progressFilled, currentTime, durationTime }) => {
    let activePointerId = null;

    const updateProgress = () => {
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const percent = duration > 0 ? Math.min((time / duration) * 100, 100) : 0;

        currentTime.textContent = fmtTime(time);
        progressFilled.style.width = `${percent}%`;
        progressBar?.setAttribute('aria-valuemin', '0');
        progressBar?.setAttribute('aria-valuemax', String(Math.floor(duration)));
        progressBar?.setAttribute('aria-valuenow', String(Math.floor(time)));
        progressBar?.setAttribute('aria-valuetext', `${fmtTime(time)} de ${fmtTime(duration)}`);
        progressBar?.setAttribute('aria-disabled', String(duration <= 0));
    };

    const seekToPointer = (event) => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        const rect = progressBar.getBoundingClientRect();
        if (!rect.width) return;

        const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = percent * audio.duration;
        updateProgress();
    };

    audio.addEventListener('loadedmetadata', () => {
        durationTime.textContent = fmtTime(audio.duration);
        updateProgress();
    });

    audio.addEventListener('durationchange', () => {
        durationTime.textContent = fmtTime(audio.duration);
        updateProgress();
    });

    audio.addEventListener('timeupdate', () => {
        updateProgress();
    });

    audio.addEventListener('ended', () => {
        button.textContent = '▶ Tocar música';
        updateProgress();
    });

    button.addEventListener('click', () => {
        if (!audio.paused) {
            audio.pause();
            button.textContent = '▶ Tocar música';
            return;
        }

        stopAllCards();
        audio.play().catch(() => {});
        button.textContent = '⏸ Pausar';
    });

    progressBar?.addEventListener('pointerdown', (event) => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        activePointerId = event.pointerId;
        progressBar.setPointerCapture(event.pointerId);
        progressBar.classList.add('is-seeking');
        seekToPointer(event);
        event.preventDefault();
    });

    progressBar?.addEventListener('pointermove', (event) => {
        if (event.pointerId === activePointerId) seekToPointer(event);
    });

    const stopSeeking = (event) => {
        if (event.pointerId !== activePointerId) return;
        activePointerId = null;
        progressBar.classList.remove('is-seeking');
    };

    progressBar?.addEventListener('pointerup', stopSeeking);
    progressBar?.addEventListener('pointercancel', stopSeeking);

    progressBar?.addEventListener('keydown', (event) => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        const step = event.shiftKey ? 10 : 5;
        let nextTime;

        switch (event.key) {
            case 'ArrowLeft':
                nextTime = audio.currentTime - step;
                break;
            case 'ArrowRight':
                nextTime = audio.currentTime + step;
                break;
            case 'Home':
                nextTime = 0;
                break;
            case 'End':
                nextTime = audio.duration;
                break;
            default:
                return;
        }

        event.preventDefault();
        audio.currentTime = Math.min(Math.max(nextTime, 0), audio.duration);
        updateProgress();
    });
};

const createTrackCard = ({ title, artist, image, src }) => {
    const card = document.createElement('div');
    card.className = 'player-container';
    card.dataset.searchValue = normalizeText(`${title} ${artist}`);
    card.innerHTML = `
        <img src="${image}" alt="${title}">
        <h2>${title}</h2>
        <p class="artista">${artist}</p>
        <div class="button-group">
            <button class="botaoPlay" type="button">▶ Tocar música</button>
            <button class="btn-add-playlist" type="button">+ Playlist</button>
            <audio class="musica" preload="metadata" loop>
                <source src="${src}" type="audio/mpeg">
            </audio>
        </div>
        <div class="progress-info">
            <span class="current-time">0:00</span>
            <span class="duration-time">0:00</span>
        </div>
        <div class="track-progress" role="slider" tabindex="0" aria-label="Progresso da música" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0" aria-valuetext="0:00 de 0:00" aria-disabled="true">
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

    bindAudioControls(track);
    track.addButton.addEventListener('click', () => addToPlaylist(track));

    DOM.cardsContainer?.appendChild(card);
    cards.push(track);
};

const renderPlaylist = () => {
    if (!DOM.playlistElement) return;

    DOM.playlistElement.replaceChildren();

    if (!state.playlist.length) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'playlist-empty';
        emptyItem.textContent = 'A playlist está vazia.';
        DOM.playlistElement.appendChild(emptyItem);
    } else {
        state.playlist.forEach((track, index) => {
            const item = document.createElement('li');
            item.className = `playlist-item${index === state.index ? ' active' : ''}`;

            const title = document.createElement('span');
            title.textContent = `${track.title} — ${track.artist}`;
            title.addEventListener('click', () => switchPlaylistTrack(index));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Excluir';
            removeButton.addEventListener('click', () => removeFromPlaylist(index));

            item.append(title, removeButton);
            DOM.playlistElement.appendChild(item);
        });
    }

    updateStatus();
};

const trackAlreadyExists = (newTrack) => {
    const normalizedNew = {
        title: normalizeText(newTrack.title),
        artist: normalizeText(newTrack.artist),
    };

    return state.playlist.some((track) => (
        normalizeText(track.title) === normalizedNew.title &&
        normalizeText(track.artist) === normalizedNew.artist
    ));
};

const addToPlaylist = (track) => {
    const playlistItem = {
        title: track.title,
        artist: track.artist,
        image: track.image || 'imagens/0x1900-000000-80-0-0.jpg',
        src: track.src,
    };

    if (trackAlreadyExists(playlistItem)) {
        alert(`"${track.title}" já está na playlist.`);
        return;
    }

    state.playlist.push(playlistItem);
    if (state.playlist.length === 1) state.index = 0;
    savePlaylist();
    renderPlaylist();
    alert(`"${track.title}" adicionada à playlist.`);
};

const switchPlaylistTrack = (index) => {
    if (!state.playlist.length) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    state.index = index;
    const current = state.playlist[state.index];
    stopAllCards();
    state.audio.src = current.src;
    state.audio.load();
    state.audio.currentTime = 0;
    state.audio.play().catch(() => {});
    setPlayButtonState(true);
    renderPlaylist();
    savePlaylist();
};

const togglePlaylist = () => {
    if (!state.playlist.length) {
        alert('Adicione músicas à playlist antes de reproduzir.');
        return;
    }

    if (state.audio.paused) {
        switchPlaylistTrack(state.index);
        return;
    }

    state.audio.pause();
    setPlayButtonState(false);
    updateStatus();
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

const removeFromPlaylist = (index) => {
    if (index < 0 || index >= state.playlist.length) return;

    state.playlist.splice(index, 1);

    if (!state.playlist.length) {
        state.audio.pause();
        state.audio.src = '';
        state.audio.currentTime = 0;
        state.index = 0;
        savePlaylist();
        renderPlaylist();
        return;
    }

    if (state.index >= state.playlist.length) state.index = state.playlist.length - 1;
    if (state.index > index) state.index -= 1;

    savePlaylist();
    renderPlaylist();
};

const addTrackFromPrompt = () => {
    const choice = Number(prompt(
        trackData.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n')
    )) - 1;

    if (!Number.isInteger(choice) || choice < 0 || choice >= trackData.length) {
        alert('Escolha inválida.');
        return;
    }

    const selectedTrack = trackData[choice];
    addToPlaylist({
        title: selectedTrack.title,
        artist: selectedTrack.artist,
        image: selectedTrack.image,
        src: selectedTrack.src,
    });
};

const setAuthenticatedHeader = (isAuthenticated) => {
    if (!DOM.authLink) return;

    const label = DOM.authLink.querySelector('#auth-label');
    if (label) label.textContent = isAuthenticated ? 'Sair' : 'Entrar';
    DOM.authLink.href = isAuthenticated ? '#' : 'cadastro e login/login.html';
};

const loadBackendSession = async () => {
    try {
        const { user } = await apiRequest('/api/me');
        const { playlist } = await apiRequest('/api/playlist');
        state.authenticated = true;
        state.profile = {
            name: user.name,
            email: user.email,
            avatar: user.avatar || '',
        };
        state.playlist = playlist;
        state.index = 0;
        setAuthenticatedHeader(true);
        renderProfile();
        renderPlaylist();
    } catch (error) {
        if (error.status !== 401) {
            console.error('Não foi possível carregar a conta do servidor.', error);
        }
    }
};

DOM.authLink?.addEventListener('click', async (event) => {
    if (!state.authenticated) return;
    event.preventDefault();

    try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
        state.authenticated = false;
        state.profile = { name: 'Usuário', email: 'usuario@email.com', avatar: '' };
        state.playlist = [];
        state.index = 0;
        localStorage.removeItem('deathMusicCurrentUser');
        writeStorage(STORAGE_KEYS.playlist, []);
        writeStorage(STORAGE_KEYS.profile, state.profile);
        setAuthenticatedHeader(false);
        renderProfile();
        renderPlaylist();
    } catch (error) {
        alert(error.message);
    }
});

DOM.addTrackButton?.addEventListener('click', addTrackFromPrompt);
DOM.playButton?.addEventListener('click', togglePlaylist);
DOM.prevButton?.addEventListener('click', prevTrack);
DOM.nextButton?.addEventListener('click', nextTrack);
DOM.searchInput?.addEventListener('input', updateSearchFilter);
DOM.profileButton?.addEventListener('click', toggleProfilePanel);
DOM.profilePhotoButton?.addEventListener('click', () => DOM.profilePhotoInput?.click());
DOM.profilePhotoInput?.addEventListener('change', (event) => {
    const [file] = event.target.files || [];
    updateProfileFromFile(file);
    event.target.value = '';
});

document.addEventListener('click', (event) => {
    const clickedInsideProfile = DOM.profileButton?.contains(event.target) || DOM.profilePanel?.contains(event.target);
    if (!clickedInsideProfile && DOM.profilePanel && !DOM.profilePanel.hasAttribute('hidden')) {
        DOM.profilePanel.setAttribute('hidden', 'hidden');
        DOM.profileButton?.setAttribute('aria-expanded', 'false');
    }
});

loadSavedProfile();
loadSavedPlaylist();
renderProfile();
if (DOM.cardsContainer) {
    trackData.forEach(createTrackCard);
    updateSearchFilter();
}
renderPlaylist();
loadBackendSession();
