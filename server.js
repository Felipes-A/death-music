const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const express = require('express');
const Database = require('better-sqlite3');
const cookieParser = require('cookie-parser');

const scrypt = promisify(crypto.scrypt);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SESSION_COOKIE = 'death_music_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const DATA_DIR = path.join(__dirname, 'data');

fs.mkdirSync(DATA_DIR, { recursive: true });

const database = new Database(path.join(DATA_DIR, 'death-music.sqlite'));
database.pragma('foreign_keys = ON');
database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar TEXT NOT NULL DEFAULT '',
        playlist TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );
`);

app.use(express.json({ limit: '3mb' }));
app.use(cookieParser());

const publicUser = (user) => ({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
});

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createSession = (userId, response) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_DURATION;

    database.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
        .run(hashToken(token), userId, expiresAt);
    database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());

    response.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: SESSION_DURATION,
        path: '/',
    });
};

const requireUser = (request, response, next) => {
    const token = request.cookies[SESSION_COOKIE];
    if (!token) {
        response.status(401).json({ error: 'Faça login para continuar.' });
        return;
    }

    const session = database.prepare(`
        SELECT users.id, users.name, users.email, users.avatar, users.playlist
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(hashToken(token), Date.now());

    if (!session) {
        response.clearCookie(SESSION_COOKIE, { path: '/' });
        response.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' });
        return;
    }

    request.user = session;
    next();
};

const normalizeEmail = (email) => email.trim().toLowerCase();
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordMatches = async (password, storedHash) => {
    const [salt, expectedHex] = storedHash.split(':');
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = await scrypt(password, salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
};

app.post('/api/auth/register', async (request, response, next) => {
    try {
        const body = request.body && typeof request.body === 'object' ? request.body : {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
        const password = typeof body.password === 'string' ? body.password : '';

        if (name.length < 2 || name.length > 80 || !validEmail(email) || password.length < 6 || password.length > 128) {
            response.status(400).json({ error: 'Informe um nome, e-mail e senha válidos. A senha deve ter ao menos 6 caracteres.' });
            return;
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = `${salt}:${(await scrypt(password, salt, 64)).toString('hex')}`;
        const result = database.prepare(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
        ).run(name, email, passwordHash);

        createSession(Number(result.lastInsertRowid), response);
        response.status(201).json({ user: { name, email, avatar: '' } });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            response.status(409).json({ error: 'Este e-mail já está cadastrado.' });
            return;
        }
        next(error);
    }
});

app.post('/api/auth/login', async (request, response, next) => {
    try {
        const body = request.body && typeof request.body === 'object' ? request.body : {};
        const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user || password.length > 128 || !(await passwordMatches(password, user.password_hash))) {
            response.status(401).json({ error: 'E-mail ou senha incorretos.' });
            return;
        }

        createSession(user.id, response);
        response.json({ user: publicUser(user) });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/logout', (request, response) => {
    const token = request.cookies[SESSION_COOKIE];
    if (token) {
        database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    }
    response.clearCookie(SESSION_COOKIE, { path: '/' });
    response.json({ message: 'Você saiu da sua conta.' });
});

app.get('/api/me', requireUser, (request, response) => {
    response.json({ user: publicUser(request.user) });
});

app.put('/api/profile', requireUser, (request, response) => {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const avatar = body.avatar;
    if (typeof avatar !== 'string' ||
        (avatar !== '' && !/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar)) ||
        Buffer.byteLength(avatar, 'utf8') > 2 * 1024 * 1024) {
        response.status(400).json({ error: 'A foto deve ser uma imagem PNG, JPEG, WebP ou GIF de até 2 MB.' });
        return;
    }

    database.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, request.user.id);
    response.json({ user: { ...publicUser(request.user), avatar } });
});

app.get('/api/playlist', requireUser, (request, response) => {
    response.json({ playlist: JSON.parse(request.user.playlist) });
});

app.put('/api/playlist', requireUser, (request, response) => {
    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const { playlist } = body;
    const isValidPlaylist = Array.isArray(playlist) &&
        playlist.length <= 100 &&
        playlist.every((track) =>
            track &&
            typeof track.title === 'string' && track.title.length <= 200 &&
            typeof track.artist === 'string' && track.artist.length <= 200 &&
            typeof track.src === 'string' && /^audio\/(?!.*\.\.)(?:%20|[^/\\%])+\.mp3$/i.test(track.src) &&
            typeof track.image === 'string' && /^imagens\/(?!.*\.\.)(?:%20|[^/\\%])+\.(?:jpg|jpeg|png|webp)$/i.test(track.image)
        );

    if (!isValidPlaylist) {
        response.status(400).json({ error: 'A playlist enviada não é válida.' });
        return;
    }

    database.prepare('UPDATE users SET playlist = ? WHERE id = ?')
        .run(JSON.stringify(playlist), request.user.id);
    response.json({ playlist });
});

app.use('/data', (request, response) => response.sendStatus(404));
app.use(express.static(__dirname, { index: false }));

app.use((error, request, response, next) => {
    console.error(error);
    if (response.headersSent) {
        next(error);
        return;
    }
    response.status(500).json({ error: 'Ocorreu um erro no servidor. Tente novamente.' });
});

app.listen(PORT, () => {
    console.log(`Death Music disponível em http://localhost:${PORT}`);
});
