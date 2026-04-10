// server/routes/authRoutes.js
const express = require('express');
const { getDb } = require('../db');
const { hashPassword, verifyPassword, signToken, requireAuth } = require('../auth');

const router = express.Router();

/* ── Validators ── */
function validateUsername(u) {
  if (!u || typeof u !== 'string') return 'Username obrigatório.';
  const clean = u.trim();
  if (clean.length < 3)  return 'Username deve ter ao menos 3 caracteres.';
  if (clean.length > 30) return 'Username deve ter no máximo 30 caracteres.';
  if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) return 'Username pode ter letras, números, _ . -';
  return null;
}
function validatePassword(p) {
  if (!p || typeof p !== 'string') return 'Senha obrigatória.';
  if (p.length < 6)  return 'Senha deve ter ao menos 6 caracteres.';
  if (p.length > 72) return 'Senha muito longa (máx 72).'; // bcrypt limit
  return null;
}

/* ─────────────────────────────────────────
   POST /auth/register
───────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameErr = validateUsername(username);
    if (usernameErr) return res.status(400).json({ error: usernameErr });

    const passwordErr = validatePassword(password);
    if (passwordErr) return res.status(400).json({ error: passwordErr });

    const db = getDb();
    const clean = username.trim();

    // Check duplicate
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(clean);
    if (existing) return res.status(409).json({ error: 'Username já em uso. Escolha outro.' });

    const hashed = await hashPassword(password);
    const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(clean, hashed);

    const token = signToken({ userId: result.lastInsertRowid, username: clean });
    return res.status(201).json({ token, username: clean, userId: result.lastInsertRowid });

  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

/* ─────────────────────────────────────────
   POST /auth/login
───────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e senha obrigatórios.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());
    if (!user) {
      // Constant-time response to prevent user enumeration
      await hashPassword('dummy'); // make timing consistent
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = signToken({ userId: user.id, username: user.username });
    return res.json({ token, username: user.username, userId: user.id });

  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

/* ─────────────────────────────────────────
   GET /auth/me   (protected)
───────────────────────────────────────── */
router.get('/me', requireAuth, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json(user);
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
