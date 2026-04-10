// server/index.js — Grimório do Aventureiro · D&D 5E API
'use strict';

const express    = require('express');
const cors       = require('cors');
const path       = require('path');

const authRoutes      = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ── */
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

// Request logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString().slice(11,19)} ${req.method} ${req.path}`);
    next();
  });
}

/* ── API Routes ── */
app.use('/api/auth',       authRoutes);
app.use('/api/characters', characterRoutes);

/* ── Health check ── */
app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

/* ── Serve static frontend ── */
const PUBLIC = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Rota não encontrada.' });
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n⚔️  Grimório do Aventureiro · D&D 5E`);
  console.log(`🌐  http://localhost:${PORT}`);
  console.log(`📦  Banco de dados: grimorio.db`);
  console.log(`✅  Servidor rodando na porta ${PORT}\n`);
});

module.exports = app;
