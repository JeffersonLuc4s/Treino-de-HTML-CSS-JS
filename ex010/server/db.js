// server/db.js — Database setup with better-sqlite3 (synchronous, zero-config)
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'grimorio.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');   // better write performance
    db.pragma('foreign_keys = ON');    // enforce FK constraints
    migrate(db);
  }
  return db;
}

function migrate(db) {
  db.exec(`
    /* ── Users ───────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      password   TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    /* ── Characters ──────────────────────────────── */
    CREATE TABLE IF NOT EXISTS characters (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nome         TEXT    NOT NULL DEFAULT '',
      raca         TEXT    NOT NULL DEFAULT '',
      classe       TEXT    NOT NULL DEFAULT '',
      raca_id      TEXT    NOT NULL DEFAULT '',
      subraca_id   TEXT    NOT NULL DEFAULT '',
      classe_id    TEXT    NOT NULL DEFAULT '',
      background_id TEXT   NOT NULL DEFAULT '',
      tendencia    TEXT    NOT NULL DEFAULT '',
      nivel        INTEGER NOT NULL DEFAULT 1,
      xp           INTEGER NOT NULL DEFAULT 0,
      velocidade   INTEGER NOT NULL DEFAULT 30,
      armadura     TEXT    NOT NULL DEFAULT 'sem_armadura',
      escudo       INTEGER NOT NULL DEFAULT 0,
      hp_atual     INTEGER NOT NULL DEFAULT 0,
      hp_max       INTEGER NOT NULL DEFAULT 0,
      hp_temp      INTEGER NOT NULL DEFAULT 0,
      hd_total     INTEGER NOT NULL DEFAULT 1,
      hd_usados    INTEGER NOT NULL DEFAULT 0,
      exaustao     INTEGER NOT NULL DEFAULT 0,
      inspiracao   INTEGER NOT NULL DEFAULT 0,
      observacoes  TEXT    NOT NULL DEFAULT '',
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    /* ── Attributes ──────────────────────────────── */
    CREATE TABLE IF NOT EXISTS attributes (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id   INTEGER NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
      forca          INTEGER NOT NULL DEFAULT 10,
      destreza       INTEGER NOT NULL DEFAULT 10,
      constituicao   INTEGER NOT NULL DEFAULT 10,
      inteligencia   INTEGER NOT NULL DEFAULT 10,
      sabedoria      INTEGER NOT NULL DEFAULT 10,
      carisma        INTEGER NOT NULL DEFAULT 10,
      forca_base     INTEGER NOT NULL DEFAULT 10,
      destreza_base  INTEGER NOT NULL DEFAULT 10,
      constituicao_base INTEGER NOT NULL DEFAULT 10,
      inteligencia_base INTEGER NOT NULL DEFAULT 10,
      sabedoria_base INTEGER NOT NULL DEFAULT 10,
      carisma_base   INTEGER NOT NULL DEFAULT 10
    );

    /* ── Saving throw proficiencies ──────────────── */
    CREATE TABLE IF NOT EXISTS saving_throw_profs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      atributo     TEXT    NOT NULL,
      UNIQUE(character_id, atributo)
    );

    /* ── Skills ──────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS skill_profs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      skill_id     TEXT    NOT NULL,
      UNIQUE(character_id, skill_id)
    );

    /* ── Inventory ───────────────────────────────── */
    CREATE TABLE IF NOT EXISTS inventory (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      item_key     TEXT    NOT NULL,
      nome         TEXT    NOT NULL DEFAULT '',
      quantidade   INTEGER NOT NULL DEFAULT 1,
      descricao    TEXT    NOT NULL DEFAULT ''
    );

    /* ── Weapons ─────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS weapons (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      weapon_key   TEXT    NOT NULL,
      nome         TEXT    NOT NULL DEFAULT '',
      dano         TEXT    NOT NULL DEFAULT '',
      atributo     TEXT    NOT NULL DEFAULT 'forca',
      proficiente  INTEGER NOT NULL DEFAULT 1,
      bonus_extra  INTEGER NOT NULL DEFAULT 0
    );

    /* ── Spells ──────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS spells (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      spell_key    TEXT    NOT NULL,
      nome         TEXT    NOT NULL DEFAULT '',
      nivel        INTEGER NOT NULL DEFAULT 0,
      preparada    INTEGER NOT NULL DEFAULT 0
    );

    /* ── Conditions ──────────────────────────────── */
    CREATE TABLE IF NOT EXISTS conditions (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      condition_id TEXT    NOT NULL,
      UNIQUE(character_id, condition_id)
    );

    /* ── Resistances ─────────────────────────────── */
    CREATE TABLE IF NOT EXISTS resistances (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      descricao    TEXT    NOT NULL DEFAULT ''
    );

    /* ── Magic ───────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS magic_config (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id   INTEGER NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
      atributo       TEXT    NOT NULL DEFAULT '',
      slots_usados   TEXT    NOT NULL DEFAULT '[]'
    );

    /* ── Personality ─────────────────────────────── */
    CREATE TABLE IF NOT EXISTS personality (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
      tracos       TEXT    NOT NULL DEFAULT '',
      ideais       TEXT    NOT NULL DEFAULT '',
      vinculos     TEXT    NOT NULL DEFAULT '',
      defeitos     TEXT    NOT NULL DEFAULT ''
    );

    /* ── Appearance ──────────────────────────────── */
    CREATE TABLE IF NOT EXISTS appearance (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
      idade        TEXT    NOT NULL DEFAULT '',
      altura       TEXT    NOT NULL DEFAULT '',
      peso         TEXT    NOT NULL DEFAULT '',
      olhos        TEXT    NOT NULL DEFAULT '',
      cabelo       TEXT    NOT NULL DEFAULT '',
      pele         TEXT    NOT NULL DEFAULT ''
    );

    /* ── Languages ───────────────────────────────── */
    CREATE TABLE IF NOT EXISTS languages (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      idioma       TEXT    NOT NULL
    );

    /* ── Coins ───────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS coins (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
      pp           INTEGER NOT NULL DEFAULT 0,
      po           INTEGER NOT NULL DEFAULT 0,
      pe           INTEGER NOT NULL DEFAULT 0,
      pc           INTEGER NOT NULL DEFAULT 0
    );
  `);
}

module.exports = { getDb };
