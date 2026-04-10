// server/routes/characterRoutes.js
const express = require('express');
const { getDb } = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth); // all character routes require auth

/* ─────────────────────────────────────────
   HELPERS — load full character object
───────────────────────────────────────── */
function loadFullCharacter(db, charId, userId) {
  const ch = db.prepare('SELECT * FROM characters WHERE id = ? AND user_id = ?').get(charId, userId);
  if (!ch) return null;

  const attrs  = db.prepare('SELECT * FROM attributes    WHERE character_id = ?').get(charId)  || {};
  const pers   = db.prepare('SELECT * FROM personality   WHERE character_id = ?').get(charId)  || {};
  const appear = db.prepare('SELECT * FROM appearance    WHERE character_id = ?').get(charId)  || {};
  const magic  = db.prepare('SELECT * FROM magic_config  WHERE character_id = ?').get(charId)  || {};
  const coins  = db.prepare('SELECT * FROM coins         WHERE character_id = ?').get(charId)  || {};
  const stProfs  = db.prepare('SELECT atributo FROM saving_throw_profs WHERE character_id = ?').all(charId);
  const skillP   = db.prepare('SELECT skill_id FROM skill_profs WHERE character_id = ?').all(charId);
  const inventory = db.prepare('SELECT * FROM inventory   WHERE character_id = ?').all(charId);
  const weapons   = db.prepare('SELECT * FROM weapons     WHERE character_id = ?').all(charId);
  const spells    = db.prepare('SELECT * FROM spells      WHERE character_id = ?').all(charId);
  const conditions = db.prepare('SELECT condition_id FROM conditions WHERE character_id = ?').all(charId);
  const resistances = db.prepare('SELECT descricao FROM resistances WHERE character_id = ?').all(charId);
  const languages   = db.prepare('SELECT idioma FROM languages WHERE character_id = ?').all(charId);

  // Reconstruct into the appData shape the frontend expects
  const savingThrowsObj = {};
  stProfs.forEach(r => { savingThrowsObj[r.atributo] = true; });

  const periciasObj = {};
  skillP.forEach(r => { periciasObj[r.skill_id] = true; });

  const condObj = {};
  conditions.forEach(r => { condObj[r.condition_id] = true; });

  return {
    _id: ch.id,
    personagem: {
      nome: ch.nome, raca: ch.raca, classe: ch.classe,
      racaId: ch.raca_id, subracaId: ch.subraca_id,
      classeId: ch.classe_id, backgroundId: ch.background_id,
      tendencia: ch.tendencia,
    },
    atributos: {
      forca: String(attrs.forca||10), destreza: String(attrs.destreza||10),
      constituicao: String(attrs.constituicao||10), inteligencia: String(attrs.inteligencia||10),
      sabedoria: String(attrs.sabedoria||10), carisma: String(attrs.carisma||10),
    },
    atributosBase: {
      forca: String(attrs.forca_base||10), destreza: String(attrs.destreza_base||10),
      constituicao: String(attrs.constituicao_base||10), inteligencia: String(attrs.inteligencia_base||10),
      sabedoria: String(attrs.sabedoria_base||10), carisma: String(attrs.carisma_base||10),
    },
    vida:    { atual: ch.hp_atual, max: ch.hp_max, temp: ch.hp_temp },
    combate: { nivel: ch.nivel, xp: ch.xp, velocidade: ch.velocidade,
               armadura: ch.armadura, escudo: !!ch.escudo },
    hitDice: { total: ch.hd_total, usados: ch.hd_usados },
    exaustao:   ch.exaustao,
    inspiracao: !!ch.inspiracao,
    observacoes: ch.observacoes,
    proficiencias: { savingThrows: savingThrowsObj },
    pericias: periciasObj,
    condicoes: condObj,
    resistencias: resistances.map(r => r.descricao),
    armas: weapons.map(w => ({
      id: w.weapon_key, nome: w.nome, dano: w.dano,
      atributo: w.atributo, proficiente: !!w.proficiente, bonusExtra: w.bonus_extra,
    })),
    inventario: inventory.map(i => ({
      id: i.item_key, nome: i.nome, quantidade: i.quantidade, descricao: i.descricao,
    })),
    spells: spells.map(s => ({
      id: s.spell_key, nome: s.nome, nivel: s.nivel, preparada: !!s.preparada,
    })),
    magias: {
      atributo: magic.atributo || '',
      slotsUsados: JSON.parse(magic.slots_usados || '[]'),
      lista: spells.map(s => ({ id: s.spell_key, nome: s.nome, nivel: s.nivel, preparada: !!s.preparada })),
    },
    personalidade: {
      tracos: pers.tracos||'', ideais: pers.ideais||'',
      vinculos: pers.vinculos||'', defeitos: pers.defeitos||'',
    },
    aparencia: {
      idade: appear.idade||'', altura: appear.altura||'', peso: appear.peso||'',
      olhos: appear.olhos||'', cabelo: appear.cabelo||'', pele: appear.pele||'',
    },
    idiomas: languages.map(l => l.idioma),
    moedas: { pp: coins.pp||0, po: coins.po||0, pe: coins.pe||0, pc: coins.pc||0 },
    background: { id: ch.background_id },
  };
}

/* ─────────────────────────────────────────
   HELPERS — save full character
───────────────────────────────────────── */
function saveFullCharacter(db, userId, data, existingId = null) {
  const p  = data.personagem    || {};
  const a  = data.atributos     || {};
  const ab = data.atributosBase || {};
  const v  = data.vida          || {};
  const c  = data.combate       || {};
  const hd = data.hitDice       || {};
  const pe = data.personalidade || {};
  const ap = data.aparencia     || {};
  const m  = data.magias        || {};
  const mo = data.moedas        || {};
  const st = data.proficiencias?.savingThrows || {};
  const sk = data.pericias      || {};
  const co = data.condicoes     || {};

  const run = db.transaction(() => {
    let charId;
    if (existingId) {
      // UPDATE
      db.prepare(`
        UPDATE characters SET
          nome=?,raca=?,classe=?,raca_id=?,subraca_id=?,classe_id=?,
          background_id=?,tendencia=?,nivel=?,xp=?,velocidade=?,
          armadura=?,escudo=?,hp_atual=?,hp_max=?,hp_temp=?,
          hd_total=?,hd_usados=?,exaustao=?,inspiracao=?,
          observacoes=?,updated_at=datetime('now')
        WHERE id=? AND user_id=?
      `).run(
        p.nome||'',p.raca||'',p.classe||'',p.racaId||'',p.subracaId||'',
        p.classeId||'',p.backgroundId||'',p.tendencia||'',
        c.nivel||1,c.xp||0,c.velocidade||30,
        c.armadura||'sem_armadura',c.escudo?1:0,
        v.atual||0,v.max||0,v.temp||0,
        hd.total||1,hd.usados||0,
        data.exaustao||0,data.inspiracao?1:0,
        data.observacoes||'',
        existingId, userId
      );
      charId = existingId;
    } else {
      // INSERT
      const r = db.prepare(`
        INSERT INTO characters
          (user_id,nome,raca,classe,raca_id,subraca_id,classe_id,background_id,tendencia,
           nivel,xp,velocidade,armadura,escudo,hp_atual,hp_max,hp_temp,
           hd_total,hd_usados,exaustao,inspiracao,observacoes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        userId,p.nome||'',p.raca||'',p.classe||'',p.racaId||'',p.subracaId||'',
        p.classeId||'',p.backgroundId||'',p.tendencia||'',
        c.nivel||1,c.xp||0,c.velocidade||30,
        c.armadura||'sem_armadura',c.escudo?1:0,
        v.atual||0,v.max||0,v.temp||0,
        hd.total||1,hd.usados||0,
        data.exaustao||0,data.inspiracao?1:0,
        data.observacoes||''
      );
      charId = r.lastInsertRowid;
    }

    // Attributes — upsert
    db.prepare(`
      INSERT INTO attributes (character_id,forca,destreza,constituicao,inteligencia,sabedoria,carisma,
        forca_base,destreza_base,constituicao_base,inteligencia_base,sabedoria_base,carisma_base)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(character_id) DO UPDATE SET
        forca=excluded.forca,destreza=excluded.destreza,constituicao=excluded.constituicao,
        inteligencia=excluded.inteligencia,sabedoria=excluded.sabedoria,carisma=excluded.carisma,
        forca_base=excluded.forca_base,destreza_base=excluded.destreza_base,
        constituicao_base=excluded.constituicao_base,inteligencia_base=excluded.inteligencia_base,
        sabedoria_base=excluded.sabedoria_base,carisma_base=excluded.carisma_base
    `).run(charId,
      parseInt(a.forca)||10,parseInt(a.destreza)||10,parseInt(a.constituicao)||10,
      parseInt(a.inteligencia)||10,parseInt(a.sabedoria)||10,parseInt(a.carisma)||10,
      parseInt(ab.forca)||10,parseInt(ab.destreza)||10,parseInt(ab.constituicao)||10,
      parseInt(ab.inteligencia)||10,parseInt(ab.sabedoria)||10,parseInt(ab.carisma)||10,
    );

    // Saving throws — clear + insert
    db.prepare('DELETE FROM saving_throw_profs WHERE character_id=?').run(charId);
    const stInsert = db.prepare('INSERT INTO saving_throw_profs (character_id,atributo) VALUES (?,?)');
    Object.entries(st).forEach(([k,v])=>{ if(v) stInsert.run(charId,k); });

    // Skills — clear + insert
    db.prepare('DELETE FROM skill_profs WHERE character_id=?').run(charId);
    const skInsert = db.prepare('INSERT INTO skill_profs (character_id,skill_id) VALUES (?,?)');
    Object.entries(sk).forEach(([k,v])=>{ if(v) skInsert.run(charId,k); });

    // Conditions — clear + insert
    db.prepare('DELETE FROM conditions WHERE character_id=?').run(charId);
    const coInsert = db.prepare('INSERT INTO conditions (character_id,condition_id) VALUES (?,?)');
    Object.entries(co).forEach(([k,v])=>{ if(v) coInsert.run(charId,k); });

    // Resistances — clear + insert
    db.prepare('DELETE FROM resistances WHERE character_id=?').run(charId);
    const resInsert = db.prepare('INSERT INTO resistances (character_id,descricao) VALUES (?,?)');
    (data.resistencias||[]).forEach(r=>{ if(r) resInsert.run(charId,r); });

    // Weapons — clear + insert
    db.prepare('DELETE FROM weapons WHERE character_id=?').run(charId);
    const wInsert = db.prepare('INSERT INTO weapons (character_id,weapon_key,nome,dano,atributo,proficiente,bonus_extra) VALUES (?,?,?,?,?,?,?)');
    (data.armas||[]).forEach(w=>{ wInsert.run(charId,w.id||'',w.nome||'',w.dano||'',w.atributo||'forca',w.proficiente?1:0,w.bonusExtra||0); });

    // Inventory — clear + insert
    db.prepare('DELETE FROM inventory WHERE character_id=?').run(charId);
    const invInsert = db.prepare('INSERT INTO inventory (character_id,item_key,nome,quantidade,descricao) VALUES (?,?,?,?,?)');
    (data.inventario||[]).forEach(i=>{ invInsert.run(charId,i.id||'',i.nome||'',i.quantidade||1,i.descricao||''); });

    // Spells — clear + insert
    db.prepare('DELETE FROM spells WHERE character_id=?').run(charId);
    const spInsert = db.prepare('INSERT INTO spells (character_id,spell_key,nome,nivel,preparada) VALUES (?,?,?,?,?)');
    (m.lista||data.spells||[]).forEach(s=>{ spInsert.run(charId,s.id||'',s.nome||'',s.nivel||0,s.preparada?1:0); });

    // Magic config — upsert
    db.prepare(`
      INSERT INTO magic_config (character_id,atributo,slots_usados) VALUES (?,?,?)
      ON CONFLICT(character_id) DO UPDATE SET atributo=excluded.atributo, slots_usados=excluded.slots_usados
    `).run(charId, m.atributo||'', JSON.stringify(m.slotsUsados||[]));

    // Personality — upsert
    db.prepare(`
      INSERT INTO personality (character_id,tracos,ideais,vinculos,defeitos) VALUES (?,?,?,?,?)
      ON CONFLICT(character_id) DO UPDATE SET tracos=excluded.tracos,ideais=excluded.ideais,vinculos=excluded.vinculos,defeitos=excluded.defeitos
    `).run(charId,pe.tracos||'',pe.ideais||'',pe.vinculos||'',pe.defeitos||'');

    // Appearance — upsert
    db.prepare(`
      INSERT INTO appearance (character_id,idade,altura,peso,olhos,cabelo,pele) VALUES (?,?,?,?,?,?,?)
      ON CONFLICT(character_id) DO UPDATE SET idade=excluded.idade,altura=excluded.altura,peso=excluded.peso,olhos=excluded.olhos,cabelo=excluded.cabelo,pele=excluded.pele
    `).run(charId,ap.idade||'',ap.altura||'',ap.peso||'',ap.olhos||'',ap.cabelo||'',ap.pele||'');

    // Languages — clear + insert
    db.prepare('DELETE FROM languages WHERE character_id=?').run(charId);
    const langInsert = db.prepare('INSERT INTO languages (character_id,idioma) VALUES (?,?)');
    (data.idiomas||[]).forEach(l=>{ if(l) langInsert.run(charId,l); });

    // Coins — upsert
    db.prepare(`
      INSERT INTO coins (character_id,pp,po,pe,pc) VALUES (?,?,?,?,?)
      ON CONFLICT(character_id) DO UPDATE SET pp=excluded.pp,po=excluded.po,pe=excluded.pe,pc=excluded.pc
    `).run(charId,mo.pp||0,mo.po||0,mo.pe||0,mo.pc||0);

    return charId;
  });

  return run();
}

/* ─────────────────────────────────────────
   GET /characters   — list user's characters
───────────────────────────────────────── */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const chars = db.prepare(
      'SELECT id, nome, raca, classe, nivel, updated_at FROM characters WHERE user_id = ? ORDER BY updated_at DESC'
    ).all(req.user.userId);
    return res.json(chars);
  } catch (err) {
    console.error('[GET /characters]', err);
    return res.status(500).json({ error: 'Erro ao listar personagens.' });
  }
});

/* ─────────────────────────────────────────
   GET /characters/:id   — load one character
───────────────────────────────────────── */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const char = loadFullCharacter(db, parseInt(req.params.id), req.user.userId);
    if (!char) return res.status(404).json({ error: 'Personagem não encontrado.' });
    return res.json(char);
  } catch (err) {
    console.error('[GET /characters/:id]', err);
    return res.status(500).json({ error: 'Erro ao carregar personagem.' });
  }
});

/* ─────────────────────────────────────────
   POST /characters   — create new character
───────────────────────────────────────── */
router.post('/', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisição inválido.' });
    }
    const db = getDb();
    const charId = saveFullCharacter(db, req.user.userId, req.body, null);
    const char   = loadFullCharacter(db, charId, req.user.userId);
    return res.status(201).json(char);
  } catch (err) {
    console.error('[POST /characters]', err);
    return res.status(500).json({ error: 'Erro ao criar personagem.' });
  }
});

/* ─────────────────────────────────────────
   PUT /characters/:id   — update character
───────────────────────────────────────── */
router.put('/:id', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisição inválido.' });
    }
    const db = getDb();
    const id = parseInt(req.params.id);

    // Verify ownership
    const existing = db.prepare('SELECT id FROM characters WHERE id = ? AND user_id = ?').get(id, req.user.userId);
    if (!existing) return res.status(404).json({ error: 'Personagem não encontrado.' });

    saveFullCharacter(db, req.user.userId, req.body, id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[PUT /characters/:id]', err);
    return res.status(500).json({ error: 'Erro ao salvar personagem.' });
  }
});

/* ─────────────────────────────────────────
   DELETE /characters/:id   — delete character
───────────────────────────────────────── */
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    const r = db.prepare('DELETE FROM characters WHERE id = ? AND user_id = ?').run(id, req.user.userId);
    if (r.changes === 0) return res.status(404).json({ error: 'Personagem não encontrado.' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /characters/:id]', err);
    return res.status(500).json({ error: 'Erro ao deletar personagem.' });
  }
});

module.exports = router;
