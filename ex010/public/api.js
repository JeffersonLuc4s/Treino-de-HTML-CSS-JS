/* ============================================================
   GRIMÓRIO DO AVENTUREIRO — api.js
   Camada de comunicação frontend ↔ backend
   ============================================================ */
'use strict';

const API_BASE = '/api';
const TOKEN_KEY = 'grimorio_token';
const USER_KEY  = 'grimorio_user';

/* ─────────────────────────────────────────────
   TOKEN HELPERS
───────────────────────────────────────────── */
const Auth = {
  getToken()  { return localStorage.getItem(TOKEN_KEY); },
  getUser()   { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('grimorio_current_char_id');
  },
  isLoggedIn() { return !!this.getToken(); },
};

/* ─────────────────────────────────────────────
   FETCH WRAPPER — adiciona Bearer token
───────────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Token expirado → força logout
  if (res.status === 401) {
    Auth.clear();
    window.dispatchEvent(new CustomEvent('auth:expired'));
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Erro ${res.status}`);
  }

  return data;
}

/* ─────────────────────────────────────────────
   AUTH ENDPOINTS
───────────────────────────────────────────── */
const AuthAPI = {
  async register(username, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { username, password },
    });
    Auth.setSession(data.token, { username: data.username, userId: data.userId });
    return data;
  },

  async login(username, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    Auth.setSession(data.token, { username: data.username, userId: data.userId });
    return data;
  },

  async me() {
    return apiFetch('/auth/me');
  },

  logout() {
    Auth.clear();
  },
};

/* ─────────────────────────────────────────────
   CHARACTER ENDPOINTS
───────────────────────────────────────────── */
const CharacterAPI = {
  /** Lista todos os personagens do usuário */
  async list() {
    return apiFetch('/characters');
  },

  /** Carrega um personagem completo */
  async get(id) {
    return apiFetch(`/characters/${id}`);
  },

  /** Cria novo personagem — retorna o objeto completo com _id */
  async create(appData) {
    return apiFetch('/characters', {
      method: 'POST',
      body: appData,
    });
  },

  /** Atualiza personagem existente */
  async update(id, appData) {
    return apiFetch(`/characters/${id}`, {
      method: 'PUT',
      body: appData,
    });
  },

  /** Deleta personagem */
  async delete(id) {
    return apiFetch(`/characters/${id}`, { method: 'DELETE' });
  },

  /** Salva com auto-detect: cria se sem ID, atualiza se tem ID */
  async save(appData, currentCharId) {
    if (currentCharId) {
      await CharacterAPI.update(currentCharId, appData);
      return currentCharId;
    } else {
      const created = await CharacterAPI.create(appData);
      return created._id;
    }
  },
};

/* ─────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────── */
window.GrimorioAPI = { Auth, AuthAPI, CharacterAPI };
