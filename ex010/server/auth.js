// server/auth.js — JWT & bcrypt utilities
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;
const JWT_SECRET  = process.env.JWT_SECRET || 'grimorio-secret-change-in-production-please';
const JWT_EXPIRES = '7d';

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET); // throws if invalid/expired
}

// Express middleware — attach req.user if valid token
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token ausente. Faça login.' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

module.exports = { hashPassword, verifyPassword, signToken, requireAuth };
