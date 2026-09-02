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
    profile: {
        name: 'Usuário',
        email: 'usuario@email.com',
        avatar: '',
    },
};

const cards = [];

const syncProfilePhoto = (avatarUrl) => {
    const hasAvatar = Boolean(avatarUrl);

    if (DOM.profileAvatar) {
        DOM.profileAvatar.src = avatarUrl || '';
        DOM.profileAvatar.hidden = !hasAvatar;
        DOM.profileAvatar.style.display = hasAvatar ? 'block' : 'none';
    }

    if (DOM.profileAvatarFallback) {
        DOM.profileAvatarFallback.hidden = hasAvatar;
        DOM.profileAvatarFallback.style.display = hasAvatar ? 'none' : 'flex';
    }

    if (DOM.profilePanelAvatar) {
        DOM.profilePanelAvatar.src = avatarUrl || '';
        DOM.profilePanelAvatar.hidden = !hasAvatar;
        DOM.profilePanelAvatar.style.display = hasAvatar ? 'block' : 'none';
    }

    if (DOM.profilePanelAvatarFallback) {
        DOM.profilePanelAvatarFallback.hidden = hasAvatar;
        DOM.profilePanelAvatarFallback.style.display = hasAvatar ? 'none' : 'flex';
    }
};

const renderProfile = () => {
    if (DOM.profileName) DOM.profileName.textContent = state.profile.name;
    if (DOM.profileEmail) DOM.profileEmail.textContent = state.profile.email;
    syncProfilePhoto(state.profile.avatar);
};

const toggleProfilePanel = () => {
    if (!DOM.profileButton || !DOM.profilePanel) return;
    const isHidden = DOM.profilePanel.hasAttribute('hidden');
    DOM.profilePanel.toggleAttribute('hidden', !isHidden);
    DOM.profileButton.setAttribute('aria-expanded', String(isHidden));
};

const updateProfileFromFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
        alert('Selecione uma imagem válida para o perfil.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        state.profile.avatar = String(event.target?.result || '');
        renderProfile();
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
        DOM.searchEmptyState.classList.toggle('visible', query && visible === 0);
        DOM.searchEmptyState.textContent = 'Nenhuma música encontrada para esta busca.';
    }
};

const updateStatus = () => {
    if (!state.playlist.length) {
        DOM.playlistStatus.textContent = 'Nenhuma música na playlist.';
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        return;
    }

    const track = state.playlist[state.index];
    DOM.playlistStatus.textContent = state.audio.paused
        ? `Pausado: ${track.title} — ${track.artist}`
        : `Tocando: ${track.title} — ${track.artist}`;
};

const stopAllCards = () => {
    cards.forEach((card) => {
        card.audio.pause();
        card.button.textContent = '▶ Tocar música';
    });
};

const bindAudioControls = ({ audio, button, progressBar, progressFilled, currentTime, durationTime }) => {
    audio.addEventListener('loadedmetadata', () => {
        durationTime.textContent = fmtTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        currentTime.textContent = fmtTime(audio.currentTime);
        if (audio.duration) {
            progressFilled.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }
    });

    audio.addEventListener('ended', () => {
        button.textContent = '▶ Tocar música';
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

    progressBar?.addEventListener('click', (event) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = percent * audio.duration;
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
            <audio class="musica" preload="none" loop>
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

    bindAudioControls(track);
    track.addButton.addEventListener('click', () => addToPlaylist(track));

    DOM.cardsContainer.appendChild(card);
    cards.push(track);
};

const renderPlaylist = () => {
    if (!DOM.playlistElement) return;

    DOM.playlistElement.innerHTML = state.playlist.length
        ? state.playlist.map((track, index) => `
            <li class="playlist-item${index === state.index ? ' active' : ''}">
                <span data-index="${index}">${track.title} — ${track.artist}</span>
                <button type="button" data-remove="${index}">Excluir</button>
            </li>
        `).join('')
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

const addToPlaylist = (track) => {
    state.playlist.push(track);
    if (state.playlist.length === 1) state.index = 0;
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

const removeFromPlaylist = (index) => {
    if (index < 0 || index >= state.playlist.length) return;
    state.playlist.splice(index, 1);

    if (!state.playlist.length) {
        state.audio.pause();
        state.index = 0;
        renderPlaylist();
        return;
    }

    if (state.index >= state.playlist.length) state.index = state.playlist.length - 1;
    if (state.index > index) state.index -= 1;

    renderPlaylist();
};

DOM.addTrackButton?.addEventListener('click', () => {
    const choice = Number(prompt(
        trackData.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n')
    )) - 1;

    if (!Number.isInteger(choice) || choice < 0 || choice >= trackData.length) {
        alert('Escolha inválida.');
        return;
    }

    addToPlaylist(cards[choice] || trackData[choice]);
});

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

renderProfile();
if (DOM.cardsContainer) {
    trackData.forEach(createTrackCard);
    updateSearchFilter();
}
renderPlaylist();
