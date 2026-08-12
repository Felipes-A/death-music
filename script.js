const DOM = {
    addTrackButton: document.getElementById('adicionar-playlist'),
    playButton: document.getElementById('play-playlist'),
    prevButton: document.getElementById('prev-track'),
    nextButton: document.getElementById('next-track'),
    playlistElement: document.getElementById('lista-playlist'),
    playlistStatus: document.getElementById('playlist-status'),
    addEmptyButton: document.getElementById('add-empty-player'),
    cardsContainer: document.querySelector('.cards-container'),
    searchInput: document.getElementById('search-input'),
    searchEmptyState: document.getElementById('search-empty-state'),
    profileButton: document.getElementById('profile-button'),
    profilePanel: document.getElementById('profile-panel'),
    profileAvatar: document.getElementById('profile-avatar'),
    profilePanelAvatar: document.getElementById('profile-panel-avatar'),
    profileAvatarFallback: document.getElementById('profile-avatar-fallback'),
    profilePanelAvatarFallback: document.getElementById('profile-panel-avatar-fallback'),
    profileName: document.getElementById('profile-name'),
    profileEmail: document.getElementById('profile-email'),
    profilePhotoInput: document.getElementById('profile-photo-input'),
    profilePhotoButton: document.getElementById('profile-photo-button'),
};

const defaultProfile = {
    name: 'Usuário',
    email: 'usuario@email.com',
    photo: '',
};

const getProfileData = () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('nome') || params.get('name') || localStorage.getItem('deathMusicName') || defaultProfile.name;
    const email = params.get('email') || localStorage.getItem('deathMusicEmail') || defaultProfile.email;
    const photo = params.get('photo') || localStorage.getItem('deathMusicPhoto') || defaultProfile.photo;

    localStorage.setItem('deathMusicName', name);
    localStorage.setItem('deathMusicEmail', email);
    localStorage.setItem('deathMusicPhoto', photo);

    return { name, email, photo };
};

const applyProfile = () => {
    const profile = getProfileData();
    const hasPhoto = Boolean(profile.photo);

    if (DOM.profileAvatar) {
        DOM.profileAvatar.src = profile.photo;
        DOM.profileAvatar.hidden = !hasPhoto;
    }
    if (DOM.profilePanelAvatar) {
        DOM.profilePanelAvatar.src = profile.photo;
        DOM.profilePanelAvatar.hidden = !hasPhoto;
    }
    if (DOM.profileAvatarFallback) {
        DOM.profileAvatarFallback.style.display = hasPhoto ? 'none' : 'flex';
    }
    if (DOM.profilePanelAvatarFallback) {
        DOM.profilePanelAvatarFallback.style.display = hasPhoto ? 'none' : 'flex';
    }
    if (DOM.profileName) DOM.profileName.textContent = profile.name;
    if (DOM.profileEmail) DOM.profileEmail.textContent = profile.email;
};

const openProfilePhotoPicker = () => {
    DOM.profilePhotoInput?.click();
};

const handleProfilePhotoSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Selecione uma imagem válida para a foto de perfil.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;
        localStorage.setItem('deathMusicPhoto', imageData);
        if (DOM.profileAvatar) {
            DOM.profileAvatar.src = imageData;
            DOM.profileAvatar.hidden = false;
        }
        if (DOM.profilePanelAvatar) {
            DOM.profilePanelAvatar.src = imageData;
            DOM.profilePanelAvatar.hidden = false;
        }
        if (DOM.profileAvatarFallback) {
            DOM.profileAvatarFallback.style.display = 'none';
        }
        if (DOM.profilePanelAvatarFallback) {
            DOM.profilePanelAvatarFallback.style.display = 'none';
        }
        DOM.profilePhotoInput.value = '';
    };
    reader.readAsDataURL(file);
};

if (DOM.profileButton && DOM.profilePanel) {
    DOM.profileButton.addEventListener('click', () => {
        const isHidden = DOM.profilePanel.hasAttribute('hidden');
        DOM.profilePanel.toggleAttribute('hidden', !isHidden);
        DOM.profileButton.setAttribute('aria-expanded', String(isHidden));
    });

    document.addEventListener('click', (event) => {
        const clickedInsideProfile = DOM.profileButton.contains(event.target) || DOM.profilePanel.contains(event.target);
        if (!clickedInsideProfile) {
            DOM.profilePanel.setAttribute('hidden', 'hidden');
            DOM.profileButton.setAttribute('aria-expanded', 'false');
        }
    });
}

if (DOM.profilePhotoButton) {
    DOM.profilePhotoButton.addEventListener('click', openProfilePhotoPicker);
}

if (DOM.profilePhotoInput) {
    DOM.profilePhotoInput.addEventListener('change', handleProfilePhotoSelection);
}

applyProfile();

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

const imageChooser = (() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    return input;
})();

let pendingDownloadCard = null;
let pendingImageCard = null;

const fmtTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = String(Math.floor(value % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const normalizeText = (value = '') => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const updateSearchFilter = () => {
    const query = normalizeText(DOM.searchInput?.value || '');
    let visibleCards = 0;

    DOM.cardsContainer?.querySelectorAll('.player-container').forEach((card) => {
        const searchableText = normalizeText(card.dataset.searchValue || card.textContent || '');
        const matches = !query || searchableText.includes(query);
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCards += 1;
    });

    if (DOM.searchEmptyState) {
        DOM.searchEmptyState.classList.toggle('visible', query && visibleCards === 0);
        DOM.searchEmptyState.textContent = 'Nenhuma música encontrada para esta busca.';
    }
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

const bindAudioControls = ({
    audio,
    button,
    progressBar,
    progressFilled,
    currentTime,
    durationTime,
}) => {
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

        state.audio.pause();
        DOM.playButton.textContent = '▶ Reproduzir playlist';
        stopAllCards();
        audio.play().catch(() => {});
        button.textContent = '⏸ Pausar';
    });

    if (progressBar) {
        progressBar.addEventListener('click', (event) => {
            if (!audio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
            audio.currentTime = percent * audio.duration;
        });
    }
};

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
    card.dataset.searchValue = normalizeText(`${title} ${artist}`);
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

    bindAudioControls(track);
    track.addButton.addEventListener('click', () => addToPlaylist(track));

    DOM.cardsContainer.appendChild(card);
    cards.push(track);
};

const setupDownloadedMusic = (file, card) => {
    const title = file.name.replace(/\.[^/.]+$/, '');
    const artist = 'Download local';
    const playButton = card.querySelector('.botaoPlay');
    const playlistButton = card.querySelector('.btn-add-playlist');
    const progressBar = card.querySelector('.track-progress');
    const progressFill = card.querySelector('.track-progress-filled');
    const currentTime = card.querySelector('.current-time');
    const durationTime = card.querySelector('.duration-time');
    const downloadBar = card.querySelector('.download-progress');
    const downloadFill = card.querySelector('.download-progress-filled');

    const titleElement = card.querySelector('.track-title');
    const artistElement = card.querySelector('.artista');

    if (titleElement) titleElement.textContent = title;
    if (artistElement) artistElement.textContent = artist;
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

    card.dataset.searchValue = normalizeText(`${title} ${artist}`);
    updateSearchFilter();

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

    bindAudioControls(track);
    playlistButton.addEventListener('click', () => addToPlaylist(track));

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

imageChooser.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Selecione uma imagem válida.');
        imageChooser.value = '';
        return;
    }

    if (!pendingImageCard) return;
    const img = pendingImageCard.querySelector('.card-image');
    const icon = pendingImageCard.querySelector('.image-icon');
    const title = pendingImageCard.querySelector('.track-title');

    if (img) {
        img.src = URL.createObjectURL(file);
        img.style.display = 'block';
    }
    if (icon) {
        icon.style.display = 'none';
    }
    if (title) {
        title.textContent = 'Escolha uma música para download';
    }

    imageChooser.value = '';
    pendingImageCard = null;
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

/*
DOM.addEmptyButton.addEventListener('click', () => {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'player-container empty-player';
    emptyCard.innerHTML = `
        <button class="delete-player-btn" type="button" aria-label="Excluir card">✕</button>
        <button class="btn-add-image" type="button">Adicionar imagem</button>
        <div class="empty-player-placeholder">
            <div class="image-preview" style="position:relative; width:100%; height:180px; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#222;">
                <img class="card-image" src="" alt="Capa da música" style="display:none; width:100%; height:100%; object-fit:cover;">
                <i class="fa-solid fa-music image-icon" style="font-size:3rem; color:#999;"></i>
            </div>
            <h2 class="track-title" style="margin:12px 0 4px;">Sem música</h2>
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

    emptyCard.dataset.searchValue = normalizeText('Sem música Sem música salva');
    emptyCard.querySelector('.delete-player-btn').addEventListener('click', () => emptyCard.remove());
    emptyCard.querySelector('.btn-add-image').addEventListener('click', () => {
        pendingImageCard = emptyCard;
        imageChooser.click();
    });
    emptyCard.querySelector('.btn-download').addEventListener('click', () => {
        pendingDownloadCard = emptyCard;
        fileChooser.click();
    });
    DOM.cardsContainer.appendChild(emptyCard);
    updateSearchFilter();
});
*/

DOM.searchInput?.addEventListener('input', updateSearchFilter);

trackData.forEach(createTrackCard);
renderPlaylist();
updateSearchFilter();
