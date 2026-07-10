const elements = {
    add: document.getElementById('adicionar-playlist'),
    play: document.getElementById('play-playlist'),
    prev: document.getElementById('prev-track'),
    next: document.getElementById('next-track'),
    list: document.getElementById('lista-playlist'),
    status: document.getElementById('playlist-status'),
};

const tracks = Array.from(document.querySelectorAll('.player-container')).map((container) => ({
    title: container.querySelector('h2').textContent.trim(),
    artist: container.querySelector('.artista').textContent.trim(),
    src: container.querySelector('audio source').src,
    audio: container.querySelector('audio'),
    button: container.querySelector('.botaoPlay'),
}));

const playlistAudio = new Audio();
let playlist = [];
let currentIndex = 0;

const setText = (element, text) => element.textContent = text;
const hasPlaylist = () => playlist.length > 0;
const currentTrack = () => playlist[currentIndex];

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

const chooseTrack = () => {
    const options = tracks.map((track, index) => `${index + 1}. ${track.title} — ${track.artist}`).join('\n');
    const choice = Number(prompt(`Escolha o número da música que deseja adicionar à playlist:\n${options}`)) - 1;

    if (!Number.isInteger(choice) || choice < 0 || choice >= tracks.length) {
        return alert('Escolha inválida. Tente novamente com um número válido.');
    }

    addTrackToPlaylist(tracks[choice]);
};

tracks.forEach((track) => {
    const addButton = document.createElement('button');
    addButton.className = 'btn-add-playlist';
    addButton.type = 'button';
    addButton.textContent = '+ Playlist';
    addButton.addEventListener('click', () => addTrackToPlaylist(track));
    track.button.parentElement.appendChild(addButton);

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

renderPlaylist();