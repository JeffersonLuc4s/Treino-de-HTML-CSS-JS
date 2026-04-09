/* ============================================================
   GRIMÓRIO DO AVENTUREIRO — D&D 5E Character Sheet
   script.js
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────
   DADOS DE RAÇAS E CLASSES
───────────────────────────────────────────── */
const RACAS_DATA = {
  humano: {
    nome: 'Humano',
    descricao: 'Versáteis e adaptáveis, humanos ganham +1 em todos os atributos.',
    bonusAtributos: { forca:1, destreza:1, constituicao:1, inteligencia:1, sabedoria:1, carisma:1 },
    vantagens: ['Bônus extra de proficiência a cada 4 níveis', 'Um talento extra no nível 1'],
    subraces: {}
  },
  elfo: {
    nome: 'Elfo',
    descricao: 'Graciosos e sábios, elfos recebem +2 em Destreza.',
    bonusAtributos: { destreza: 2 },
    vantagens: ['Visão no escuro 60 pés', 'Imune a sono mágico', 'Vantagem em testes vs encantamento'],
    subraces: {
      alto_elfo: {
        nome: 'Alto Elfo',
        descricao: '+1 Inteligência. Conhece um truque do grimório de mago.',
        bonusAtributos: { inteligencia: 1 },
        vantagens: ['Um truque de mago adicional', 'Proficiência em espada longa e arco longo']
      },
      elfo_floresta: {
        nome: 'Elfo da Floresta',
        descricao: '+1 Sabedoria. Deslocamento 35 pés.',
        bonusAtributos: { sabedoria: 1 },
        vantagens: ['Deslocamento aumentado para 35 pés', 'Pode se esconder em terreno com vegetação leve']
      }
    }
  },
  anao: {
    nome: 'Anão',
    descricao: 'Resistentes e determinados, anões recebem +2 em Constituição.',
    bonusAtributos: { constituicao: 2 },
    vantagens: ['Resistência a veneno', 'Visão no escuro 60 pés', 'Proficiência com machados e picaretas'],
    subraces: {
      anao_colina: {
        nome: 'Anão da Colina',
        descricao: '+1 Sabedoria. +1 ponto de vida por nível.',
        bonusAtributos: { sabedoria: 1 },
        vantagens: ['+1 PV por nível', 'Proficiência em Percepção']
      },
      anao_montanha: {
        nome: 'Anão da Montanha',
        descricao: '+2 Força. Proficiência com armaduras leves e médias.',
        bonusAtributos: { forca: 2 },
        vantagens: ['Proficiência com armaduras leves e médias', 'Equipamento de combate tradicional']
      }
    }
  }
};

const CLASSES_DATA = {
  guerreiro: {
    nome: 'Guerreiro',
    descricao: 'Mestre das armas e armaduras. Vida base d10.',
    vidaBase: 10,
    savingThrows: ['forca', 'constituicao'],
    periciasBase: ['atletismo', 'percepcao'],
    vantagens: ['Segundo fôlego', 'Surto de ação no nível 2', 'Estilo de combate']
  },
  mago: {
    nome: 'Mago',
    descricao: 'Estudioso da magia arcana. Vida base d6.',
    vidaBase: 6,
    savingThrows: ['inteligencia', 'sabedoria'],
    periciasBase: ['arcanismo', 'historia'],
    vantagens: ['Grimório de magias', 'Recuperação arcana', 'Tradição arcana no nível 2']
  },
  ladino: {
    nome: 'Ladino',
    descricao: 'Especialista em furtividade e esperteza. Vida base d8.',
    vidaBase: 8,
    savingThrows: ['destreza', 'inteligencia'],
    periciasBase: ['acrobacia', 'furtividade', 'prestidigitacao'],
    vantagens: ['Ataque furtivo', 'Jargão dos ladrões', 'Esquiva ágil']
  }
};

/* ─────────────────────────────────────────────
   CONSTANTES & ESTADO
───────────────────────────────────────────── */
const STORAGE_KEY = 'dnd5e_ficha_v1';

const defaultData = () => ({
  personagem: { nome:'', raca:'', classe:'', vida:'', ca:'', nivel:'1', xp:'' },
  atributos:  { forca:'10', destreza:'10', constituicao:'10', inteligencia:'10', sabedoria:'10', carisma:'10' },
  equipamentos: [],
  observacoes: '',
  pericias: {},
  proficiencias: { savingThrows: {} }
});

let appData    = defaultData();
let saveTimeout = null;

/* ─────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────── */
const calcMod   = v => { const n = parseInt(v); return isNaN(n) || n < 1 ? null : Math.floor((n-10)/2); };
const formatMod = m => m === null ? '—' : m >= 0 ? `+${m}` : `${m}`;
const genId     = () => `w_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const escapeHtml = s => typeof s!=='string' ? '' :
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

function getProfBonus(nivel) {
  const n = parseInt(nivel)||1;
  if (n<=4) return 2; if (n<=8) return 3; if (n<=12) return 4; if (n<=16) return 5; return 6;
}

/* ─────────────────────────────────────────────
   LOCAL STORAGE
───────────────────────────────────────────── */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const d = defaultData();
    return {
      personagem:    { ...d.personagem,   ...p.personagem },
      atributos:     { ...d.atributos,    ...p.atributos },
      equipamentos:  Array.isArray(p.equipamentos) ? p.equipamentos : [],
      observacoes:   typeof p.observacoes==='string' ? p.observacoes : '',
      pericias:      (p.pericias && typeof p.pericias==='object') ? p.pericias : {},
      proficiencias: { savingThrows: (p.proficiencias?.savingThrows && typeof p.proficiencias.savingThrows==='object') ? p.proficiencias.savingThrows : {} }
    };
  } catch { return null; }
}

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); showToast(); }
  catch(e) { console.warn('Erro ao salvar:', e); }
}

function debouncedSave() { clearTimeout(saveTimeout); saveTimeout = setTimeout(saveToStorage, 600); }

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
let toastTimer = null;
function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─────────────────────────────────────────────
   TELA DE CRIAÇÃO DE PERSONAGEM
───────────────────────────────────────────── */
function initCreationScreen() {
  const racaSel   = document.getElementById('cr-raca');
  const subSel    = document.getElementById('cr-subraca');
  const classeSel = document.getElementById('cr-classe');

  racaSel.addEventListener('change', () => {
    updateSubracaOptions(racaSel.value);
    updatePreview();
  });
  subSel.addEventListener('change', updatePreview);
  classeSel.addEventListener('change', updatePreview);
  document.getElementById('cr-nome').addEventListener('input', clearError.bind(null, 'cr-nome', 'err-nome'));

  document.getElementById('btn-criar').addEventListener('click', handleCriarPersonagem);
}

function updateSubracaOptions(racaId) {
  const subSel = document.getElementById('cr-subraca');
  subSel.innerHTML = '';

  if (!racaId || !RACAS_DATA[racaId]) {
    subSel.innerHTML = '<option value="">— selecione a raça primeiro —</option>';
    subSel.disabled = true;
    return;
  }

  const subraces = RACAS_DATA[racaId].subraces;
  const keys     = Object.keys(subraces);

  if (keys.length === 0) {
    subSel.innerHTML = '<option value="">— sem sub-raça —</option>';
    subSel.disabled = true;
    return;
  }

  subSel.disabled = false;
  subSel.innerHTML = '<option value="">— nenhuma —</option>';
  keys.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = subraces[k].nome;
    subSel.appendChild(opt);
  });
}

function calcPreviewAttrs() {
  const racaId  = document.getElementById('cr-raca').value;
  const subId   = document.getElementById('cr-subraca').value;
  const base    = { forca:10, destreza:10, constituicao:10, inteligencia:10, sabedoria:10, carisma:10 };
  const bonuses = {};

  if (racaId && RACAS_DATA[racaId]) {
    const raca = RACAS_DATA[racaId];
    Object.entries(raca.bonusAtributos || {}).forEach(([k,v]) => {
      base[k] = (base[k]||10) + v;
      bonuses[k] = (bonuses[k]||0) + v;
    });
    if (subId && raca.subraces[subId]) {
      Object.entries(raca.subraces[subId].bonusAtributos || {}).forEach(([k,v]) => {
        base[k] = (base[k]||10) + v;
        bonuses[k] = (bonuses[k]||0) + v;
      });
    }
  }
  return { attrs: base, bonuses };
}

function updatePreview() {
  const racaId   = document.getElementById('cr-raca').value;
  const subId    = document.getElementById('cr-subraca').value;
  const classeId = document.getElementById('cr-classe').value;

  // Raça
  const racaDescEl   = document.getElementById('preview-raca-desc');
  const racaBonusEl  = document.getElementById('preview-raca-bonus');

  if (!racaId) {
    racaDescEl.textContent = 'Selecione uma raça para ver os bônus.';
    racaBonusEl.innerHTML  = '';
  } else {
    const raca = RACAS_DATA[racaId];
    let desc   = raca.descricao;
    let bonusHtml = '';

    // Bônus da raça base
    Object.entries(raca.bonusAtributos).forEach(([attr, val]) => {
      bonusHtml += `<div class="preview-bonus-item"><span class="bonus-val">+${val}</span>${attrLabel(attr)} <span class="bonus-tag">raça</span></div>`;
    });

    // Sub-raça
    if (subId && raca.subraces[subId]) {
      const sub = raca.subraces[subId];
      desc += ' ' + sub.descricao;
      Object.entries(sub.bonusAtributos).forEach(([attr, val]) => {
        bonusHtml += `<div class="preview-bonus-item"><span class="bonus-val">+${val}</span>${attrLabel(attr)} <span class="bonus-tag">sub-raça</span></div>`;
      });
      raca.subraces[subId].vantagens.forEach(v => {
        bonusHtml += `<div class="preview-bonus-item">✦ ${v}</div>`;
      });
    } else {
      raca.vantagens.forEach(v => {
        bonusHtml += `<div class="preview-bonus-item">✦ ${v}</div>`;
      });
    }

    racaDescEl.textContent = desc;
    racaBonusEl.innerHTML  = bonusHtml;
  }

  // Classe
  const classeDescEl = document.getElementById('preview-classe-desc');
  const classeInfoEl = document.getElementById('preview-classe-info');

  if (!classeId) {
    classeDescEl.textContent = 'Selecione uma classe para ver os benefícios.';
    classeInfoEl.innerHTML   = '';
  } else {
    const cls  = CLASSES_DATA[classeId];
    let info   = '';
    info += `<div class="preview-bonus-item">🎲 Dado de Vida: d${cls.vidaBase} (${cls.vidaBase} PV no nível 1)</div>`;
    info += `<div class="preview-bonus-item">🛡 Saving Throws: ${cls.savingThrows.map(attrLabel).join(', ')}</div>`;
    info += `<div class="preview-bonus-item">📖 Perícias sugeridas: ${cls.periciasBase.map(skillLabel).join(', ')}</div>`;
    cls.vantagens.forEach(v => { info += `<div class="preview-bonus-item">✦ ${v}</div>`; });

    classeDescEl.textContent = cls.descricao;
    classeInfoEl.innerHTML   = info;
  }

  // Atributos preview
  const { attrs, bonuses } = calcPreviewAttrs();
  ['forca','destreza','constituicao','inteligencia','sabedoria','carisma'].forEach(attr => {
    const el = document.getElementById(`pv-${attr}`);
    const pa = el?.closest('.pattr');
    if (el) {
      el.textContent = attrs[attr];
      if (pa) pa.classList.toggle('boosted', !!bonuses[attr]);
    }
  });
}

function attrLabel(attr) {
  const map = { forca:'Força', destreza:'Destreza', constituicao:'Constituição', inteligencia:'Inteligência', sabedoria:'Sabedoria', carisma:'Carisma' };
  return map[attr] || attr;
}

function skillLabel(skill) {
  const map = {
    atletismo:'Atletismo', acrobacia:'Acrobacia', furtividade:'Furtividade',
    prestidigitacao:'Prestidigitação', arcanismo:'Arcanismo', historia:'História',
    investigacao:'Investigação', natureza:'Natureza', religiao:'Religião',
    percepcao:'Percepção', intuicao:'Intuição', medicina:'Medicina',
    sobrevivencia:'Sobrevivência', adestrar_animais:'Adestrar Animais',
    enganacao:'Enganação', intimidacao:'Intimidação', persuasao:'Persuasão', atuacao:'Atuação'
  };
  return map[skill] || skill;
}

function clearError(inputId, errId) {
  document.getElementById(inputId)?.closest('.creation-field')?.classList.remove('has-error');
}

function validateCreation() {
  let valid = true;
  const nome    = document.getElementById('cr-nome').value.trim();
  const racaId  = document.getElementById('cr-raca').value;
  const classeId= document.getElementById('cr-classe').value;

  if (!nome) {
    document.getElementById('cr-nome').closest('.creation-field').classList.add('has-error');
    valid = false;
  } else {
    document.getElementById('cr-nome').closest('.creation-field').classList.remove('has-error');
  }

  if (!racaId) {
    document.getElementById('cr-raca').closest('.creation-field').classList.add('has-error');
    valid = false;
  } else {
    document.getElementById('cr-raca').closest('.creation-field').classList.remove('has-error');
  }

  if (!classeId) {
    document.getElementById('cr-classe').closest('.creation-field').classList.add('has-error');
    valid = false;
  } else {
    document.getElementById('cr-classe').closest('.creation-field').classList.remove('has-error');
  }

  return valid;
}

function handleCriarPersonagem() {
  if (!validateCreation()) return;

  const nome     = document.getElementById('cr-nome').value.trim();
  const racaId   = document.getElementById('cr-raca').value;
  const subId    = document.getElementById('cr-subraca').value;
  const classeId = document.getElementById('cr-classe').value;

  const raca   = RACAS_DATA[racaId];
  const classe = CLASSES_DATA[classeId];

  // Montar label de raça
  let racaLabel = raca.nome;
  if (subId && raca.subraces[subId]) racaLabel += ' (' + raca.subraces[subId].nome + ')';

  // Atributos: base 10 + bônus da raça + sub-raça
  const { attrs } = calcPreviewAttrs();

  // Saving throws da classe
  const savingThrows = {};
  classe.savingThrows.forEach(st => { savingThrows[st] = true; });

  // Perícias sugeridas da classe
  const pericias = {};
  classe.periciasBase.forEach(p => { pericias[p] = true; });

  // Montar novo estado
  appData = {
    personagem: {
      nome,
      raca:   racaLabel,
      classe: classe.nome,
      vida:   String(classe.vidaBase),
      ca:     '10',
      nivel:  '1',
      xp:     '0'
    },
    atributos: {
      forca:        String(attrs.forca),
      destreza:     String(attrs.destreza),
      constituicao: String(attrs.constituicao),
      inteligencia: String(attrs.inteligencia),
      sabedoria:    String(attrs.sabedoria),
      carisma:      String(attrs.carisma)
    },
    equipamentos: [],
    observacoes:  '',
    pericias,
    proficiencias: { savingThrows }
  };

  saveToStorage();
  showApp();
}

/* ─────────────────────────────────────────────
   MOSTRAR / ESCONDER TELAS
───────────────────────────────────────────── */
function showApp() {
  document.getElementById('creation-overlay').classList.add('hidden');
  const app = document.getElementById('app-wrapper');
  app.style.display = 'flex';
  app.style.flexDirection = 'column';

  // Reset DOM renderizados para forçar re-render
  const stList = document.getElementById('saving-throws-list');
  const ppList = document.getElementById('prof-pericias-list');
  if (stList) delete stList.dataset.built;
  if (ppList) delete ppList.dataset.built;

  renderAll();
}

function showCreation() {
  document.getElementById('creation-overlay').classList.remove('hidden');
  document.getElementById('app-wrapper').style.display = 'none';
  // Reset preview
  document.getElementById('cr-nome').value  = '';
  document.getElementById('cr-raca').value  = '';
  document.getElementById('cr-classe').value = '';
  updateSubracaOptions('');
  updatePreview();
}

/* ─────────────────────────────────────────────
   ABAS
───────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 1: PERSONAGEM
───────────────────────────────────────────── */
const personagemFields = ['nome','raca','classe','vida','ca','nivel','xp'];

function renderPersonagem() {
  personagemFields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = appData.personagem[f] || '';
  });
}

function bindPersonagem() {
  personagemFields.forEach(f => {
    const el = document.getElementById(f);
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('invalid');
      if (el.type==='number') {
        const v = parseInt(el.value), mn = parseInt(el.min), mx = parseInt(el.max);
        if (el.value!=='' && (isNaN(v) || v<mn || (el.max && v>mx))) { el.classList.add('invalid'); return; }
      }
      appData.personagem[f] = el.value;
      if (f==='nivel') { renderSavingThrows(); updateAllAtributosST(); }
      debouncedSave();
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 2: ATRIBUTOS
───────────────────────────────────────────── */
const atributosFields = ['forca','destreza','constituicao','inteligencia','sabedoria','carisma'];

function renderAtributos() {
  atributosFields.forEach(attr => {
    const input = document.getElementById(attr);
    const modEl = document.getElementById(`mod-${attr}`);
    if (!input) return;
    input.value = appData.atributos[attr] || '';
    updateMod(modEl, input.value);
  });
}

function updateMod(modEl, value) {
  if (!modEl) return;
  const mod = calcMod(value);
  modEl.textContent = formatMod(mod);
  modEl.classList.remove('positive','negative');
  if (mod!==null) { if (mod>0) modEl.classList.add('positive'); else if (mod<0) modEl.classList.add('negative'); }
}

function bindAtributos() {
  atributosFields.forEach(attr => {
    const input = document.getElementById(attr);
    const modEl = document.getElementById(`mod-${attr}`);
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const v = parseInt(input.value);
      if (input.value!=='' && (isNaN(v)||v<1||v>30)) { input.classList.add('invalid'); return; }
      appData.atributos[attr] = input.value;
      updateMod(modEl, input.value);
      renderSavingThrows();
      updateAllAtributosST();
      updateAllSkillMods();
      debouncedSave();
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 3: PROFICIÊNCIAS — SAVING THROWS
───────────────────────────────────────────── */
const ST_DEF = [
  { id:'forca',        nome:'Força',        rune:'ᚠ' },
  { id:'destreza',     nome:'Destreza',     rune:'ᚢ' },
  { id:'constituicao', nome:'Constituição', rune:'ᚱ' },
  { id:'inteligencia', nome:'Inteligência', rune:'ᛁ' },
  { id:'sabedoria',    nome:'Sabedoria',    rune:'ᛊ' },
  { id:'carisma',      nome:'Carisma',      rune:'ᛏ' },
];

function calcST(attr, prof) {
  const nivel = appData.personagem.nivel || 1;
  const attrMod = Math.floor(((parseInt(appData.atributos[attr])||10) - 10) / 2);
  return attrMod + (prof ? getProfBonus(nivel) : 0);
}

function buildSTTooltip(attr, prof) {
  const nivel   = appData.personagem.nivel || 1;
  const attrMod = Math.floor(((parseInt(appData.atributos[attr])||10) - 10) / 2);
  const pb      = getProfBonus(nivel);
  return prof
    ? `${formatMod(attrMod)} (mod) + ${pb} (prof) = ${formatMod(attrMod+pb)}`
    : `${formatMod(attrMod)} (mod) · sem proficiência`;
}

function updateAllAtributosST() {
  ST_DEF.forEach(({ id }) => {
    const stEl = document.getElementById(`st-${id}`);
    if (!stEl) return;
    const prof = !!appData.proficiencias.savingThrows[id];
    const val  = calcST(id, prof);
    const str  = formatMod(val);
    if (stEl.textContent !== str) {
      stEl.textContent = str;
      stEl.classList.remove('bump'); void stEl.offsetWidth; stEl.classList.add('bump');
    }
    stEl.className = ['attr-st', prof?'st-proficient':'', val>0?'positive':val<0?'negative':''].filter(Boolean).join(' ');
  });
}

function renderSavingThrows() {
  const nivel = appData.personagem.nivel || 1;
  const bonus = getProfBonus(nivel);
  const bEl = document.getElementById('st-prof-bonus-display');
  const nEl = document.getElementById('st-prof-nivel-display');
  if (bEl) bEl.textContent = `+${bonus}`;
  if (nEl) nEl.textContent = parseInt(nivel)||1;

  const container = document.getElementById('saving-throws-list');
  if (!container) return;

  if (!container.dataset.built) {
    container.innerHTML = '';
    ST_DEF.forEach(st => {
      const prof    = !!appData.proficiencias.savingThrows[st.id];
      const mod     = calcST(st.id, prof);
      const attrMod = Math.floor(((parseInt(appData.atributos[st.id])||10)-10)/2);

      const row = document.createElement('div');
      row.classList.add('st-row');
      if (prof) row.classList.add('st-prof-active');
      row.dataset.stId = st.id;

      row.innerHTML = `
        <input type="checkbox" class="st-checkbox" id="st-cb-${st.id}"
               aria-label="Proficiência em saving throw de ${st.nome}" ${prof?'checked':''} />
        <span class="st-rune">${st.rune}</span>
        <label class="st-name" for="st-cb-${st.id}">${st.nome}</label>
        <span class="st-prof-badge">PROF</span>
        <span class="st-attr-mod" id="statmod-${st.id}">${formatMod(attrMod)}</span>
        <span class="st-mod ${mod>0?'positive':mod<0?'negative':''}" id="stmod-${st.id}">${formatMod(mod)}</span>
        <span class="st-tooltip" id="sttt-${st.id}">${buildSTTooltip(st.id, prof)}</span>
      `;

      row.querySelector('.st-checkbox').addEventListener('change', e => {
        appData.proficiencias.savingThrows[st.id] = e.target.checked;
        row.classList.toggle('st-prof-active', e.target.checked);
        updateSingleST(st.id);
        updateAllAtributosST();
        debouncedSave();
      });

      container.appendChild(row);
    });
    container.dataset.built = '1';
  } else {
    ST_DEF.forEach(st => updateSingleST(st.id));
  }

  renderProfPericiasList();
}

function updateSingleST(id) {
  const prof    = !!appData.proficiencias.savingThrows[id];
  const val     = calcST(id, prof);
  const str     = formatMod(val);
  const attrMod = Math.floor(((parseInt(appData.atributos[id])||10)-10)/2);

  const modEl  = document.getElementById(`stmod-${id}`);
  const ttEl   = document.getElementById(`sttt-${id}`);
  const amEl   = document.getElementById(`statmod-${id}`);

  if (amEl) amEl.textContent = formatMod(attrMod);
  if (modEl && modEl.textContent!==str) {
    modEl.textContent = str;
    modEl.className = `st-mod ${val>0?'positive':val<0?'negative':''}`;
    modEl.classList.remove('bump'); void modEl.offsetWidth; modEl.classList.add('bump');
  }
  if (ttEl) ttEl.textContent = buildSTTooltip(id, prof);
}

/* ─────────────────────────────────────────────
   ABA 3: PROFICIÊNCIAS — PERÍCIAS
───────────────────────────────────────────── */
const PERICIAS_DEF = [
  { grupo:'Força',        atributo:'forca',        rune:'ᚠ', pericias:[{ id:'atletismo',       nome:'Atletismo' }] },
  { grupo:'Destreza',     atributo:'destreza',     rune:'ᚢ', pericias:[
    { id:'acrobacia',       nome:'Acrobacia' },
    { id:'furtividade',     nome:'Furtividade' },
    { id:'prestidigitacao', nome:'Prestidigitação' }
  ]},
  { grupo:'Inteligência', atributo:'inteligencia', rune:'ᛁ', pericias:[
    { id:'arcanismo',    nome:'Arcanismo' },
    { id:'historia',     nome:'História' },
    { id:'investigacao', nome:'Investigação' },
    { id:'natureza',     nome:'Natureza' },
    { id:'religiao',     nome:'Religião' }
  ]},
  { grupo:'Sabedoria',    atributo:'sabedoria',    rune:'ᛊ', pericias:[
    { id:'percepcao',        nome:'Percepção' },
    { id:'intuicao',         nome:'Intuição' },
    { id:'medicina',         nome:'Medicina' },
    { id:'sobrevivencia',    nome:'Sobrevivência' },
    { id:'adestrar_animais', nome:'Adestrar Animais' }
  ]},
  { grupo:'Carisma',      atributo:'carisma',      rune:'ᛏ', pericias:[
    { id:'enganacao',   nome:'Enganação' },
    { id:'intimidacao', nome:'Intimidação' },
    { id:'persuasao',   nome:'Persuasão' },
    { id:'atuacao',     nome:'Atuação' }
  ]}
];

function calcSkillMod(atributo, prof) {
  const nivel   = appData.personagem.nivel || 1;
  const attrMod = Math.floor(((parseInt(appData.atributos[atributo])||10)-10)/2);
  return attrMod + (prof ? getProfBonus(nivel) : 0);
}

function buildSkillTooltip(atributo, prof) {
  const nivel   = appData.personagem.nivel || 1;
  const attrMod = Math.floor(((parseInt(appData.atributos[atributo])||10)-10)/2);
  const pb      = getProfBonus(nivel);
  return prof
    ? `${formatMod(attrMod)} (${atributo}) + ${pb} (prof) = ${formatMod(attrMod+pb)}`
    : `${formatMod(attrMod)} (${atributo}) sem proficiência`;
}

function renderProfPericiasList() {
  const container = document.getElementById('prof-pericias-list');
  if (!container) return;
  const nivel = appData.personagem.nivel || 1;

  if (!container.dataset.built) {
    container.innerHTML = '';

    PERICIAS_DEF.forEach(group => {
      const attrMod = Math.floor(((parseInt(appData.atributos[group.atributo])||10)-10)/2);

      const groupEl = document.createElement('div');
      groupEl.classList.add('skill-group');
      groupEl.innerHTML = `
        <div class="skill-group-header">
          <span class="skill-group-rune">${group.rune}</span>
          <span class="skill-group-name">${group.grupo}</span>
          <span class="skill-group-mod" id="sgmod-${group.atributo}">${formatMod(attrMod)}</span>
        </div>`;

      group.pericias.forEach(skill => {
        const isProficient = !!appData.pericias[skill.id];
        const mod = calcSkillMod(group.atributo, isProficient);

        const row = document.createElement('div');
        row.classList.add('skill-row');
        row.dataset.skillId  = skill.id;
        row.dataset.atributo = group.atributo;
        if (isProficient) row.classList.add('proficient');

        row.innerHTML = `
          <input type="checkbox" class="skill-checkbox" id="skill-${skill.id}"
                 aria-label="Proficiência em ${skill.nome}" ${isProficient?'checked':''} />
          <label class="skill-name" for="skill-${skill.id}">${skill.nome}</label>
          <span class="skill-prof-tag">PROF</span>
          <span class="skill-mod ${mod>0?'positive':mod<0?'negative':'zero'}"
                id="skmod-${skill.id}">${formatMod(mod)}</span>
          <span class="skill-tooltip" id="sktt-${skill.id}">${buildSkillTooltip(group.atributo, isProficient)}</span>
        `;

        row.querySelector('.skill-checkbox').addEventListener('change', e => {
          appData.pericias[skill.id] = e.target.checked;
          row.classList.toggle('proficient', e.target.checked);
          updateSingleSkill(skill.id, group.atributo);
          debouncedSave();
        });

        groupEl.appendChild(row);
      });

      container.appendChild(groupEl);
    });

    container.dataset.built = '1';
  } else {
    updateAllSkillMods();
  }
}

function updateSingleSkill(skillId, atributo) {
  const prof = !!appData.pericias[skillId];
  const mod  = calcSkillMod(atributo, prof);
  const str  = formatMod(mod);

  const modEl = document.getElementById(`skmod-${skillId}`);
  const ttEl  = document.getElementById(`sktt-${skillId}`);
  const row   = document.querySelector(`.skill-row[data-skill-id="${skillId}"]`);

  if (row) row.classList.toggle('proficient', prof);

  if (modEl && modEl.textContent !== str) {
    modEl.textContent = str;
    modEl.className = `skill-mod ${mod>0?'positive':mod<0?'negative':'zero'}`;
    modEl.classList.remove('bump'); void modEl.offsetWidth; modEl.classList.add('bump');
  }
  if (ttEl) ttEl.textContent = buildSkillTooltip(atributo, prof);
}

function updateAllSkillMods() {
  const nivel = appData.personagem.nivel || 1;
  PERICIAS_DEF.forEach(group => {
    const attrMod = Math.floor(((parseInt(appData.atributos[group.atributo])||10)-10)/2);
    const sgEl = document.getElementById(`sgmod-${group.atributo}`);
    if (sgEl) sgEl.textContent = formatMod(attrMod);

    group.pericias.forEach(skill => updateSingleSkill(skill.id, group.atributo));
  });
}

/* ─────────────────────────────────────────────
   ABA 4: ARMAS
───────────────────────────────────────────── */
function renderWeapons() {
  const list  = document.getElementById('weapons-list');
  const empty = document.getElementById('empty-weapons');
  list.innerHTML = '';
  if (appData.equipamentos.length === 0) {
    empty.style.display = 'flex';
  } else {
    empty.style.display = 'none';
    appData.equipamentos.forEach((w, i) => list.appendChild(createWeaponCard(w, i)));
  }
}

function createWeaponCard(weapon, index) {
  const card = document.createElement('div');
  card.classList.add('weapon-card');
  card.dataset.id = weapon.id;

  card.innerHTML = `
    <div class="weapon-card-header">
      <span class="weapon-num">Arma ${index+1}</span>
      <span class="weapon-title">${escapeHtml(weapon.nome)||'Sem nome'}</span>
      <button class="btn-remove-weapon" type="button" aria-label="Remover arma ${index+1}">✕</button>
    </div>
    <div class="weapon-fields">
      <div class="field">
        <label for="w-nome-${weapon.id}">Nome</label>
        <input type="text" id="w-nome-${weapon.id}" value="${escapeHtml(weapon.nome)}"
               placeholder="Ex: Espada Longa" maxlength="40" data-field="nome" data-id="${weapon.id}" />
      </div>
      <div class="field">
        <label for="w-dano-${weapon.id}">Dano</label>
        <input type="text" id="w-dano-${weapon.id}" value="${escapeHtml(weapon.dano)}"
               placeholder="Ex: 1d8" maxlength="20" data-field="dano" data-id="${weapon.id}" />
      </div>
      <div class="field">
        <label for="w-attr-${weapon.id}">Atributo</label>
        <select id="w-attr-${weapon.id}" data-field="atributo" data-id="${weapon.id}">
          <option value="forca"    ${weapon.atributo==='forca'?'selected':''}>Força</option>
          <option value="destreza" ${weapon.atributo==='destreza'?'selected':''}>Destreza</option>
        </select>
      </div>
    </div>`;

  card.querySelector('.btn-remove-weapon').addEventListener('click', () => {
    appData.equipamentos = appData.equipamentos.filter(w => w.id !== weapon.id);
    saveToStorage(); renderWeapons();
  });

  card.querySelectorAll('input,select').forEach(el => {
    el.addEventListener('input',  () => updateWeaponField(el.dataset.id, el.dataset.field, el.value));
    el.addEventListener('change', () => updateWeaponField(el.dataset.id, el.dataset.field, el.value));
  });

  return card;
}

function updateWeaponField(id, field, value) {
  const w = appData.equipamentos.find(x => x.id === id);
  if (!w) return;
  w[field] = value;
  if (field==='nome') {
    const t = document.querySelector(`.weapon-card[data-id="${id}"] .weapon-title`);
    if (t) t.textContent = value || 'Sem nome';
  }
  debouncedSave();
}

function bindEquipamentos() {
  document.getElementById('btn-add-weapon').addEventListener('click', () => {
    const nw = { id:genId(), nome:'', dano:'', atributo:'forca' };
    appData.equipamentos.push(nw);
    saveToStorage(); renderWeapons();
    requestAnimationFrame(() => document.getElementById(`w-nome-${nw.id}`)?.focus());
  });
}

/* ─────────────────────────────────────────────
   ABA 5: NOTAS
───────────────────────────────────────────── */
function renderObservacoes() {
  const ta = document.getElementById('observacoes');
  if (!ta) return;
  ta.value = appData.observacoes || '';
  document.getElementById('char-count').textContent = ta.value.length.toLocaleString('pt-BR');
}

function bindObservacoes() {
  const ta = document.getElementById('observacoes');
  if (!ta) return;
  ta.addEventListener('input', () => {
    appData.observacoes = ta.value;
    document.getElementById('char-count').textContent = ta.value.length.toLocaleString('pt-BR');
    debouncedSave();
  });
}

/* ─────────────────────────────────────────────
   RESET / NOVO PERSONAGEM
───────────────────────────────────────────── */
let modalMode = 'reset'; // 'reset' ou 'new'

function bindReset() {
  const modal      = document.getElementById('modal-reset');
  const btnCancel  = document.getElementById('btn-cancel-reset');
  const btnConfirm = document.getElementById('btn-confirm-reset');

  document.getElementById('btn-reset').addEventListener('click', () => {
    modalMode = 'reset';
    document.getElementById('modal-icon').textContent = '⚠️';
    document.getElementById('modal-title').textContent = 'Limpar Ficha?';
    document.getElementById('modal-text').textContent = 'Todos os dados serão apagados. Esta ação não pode ser desfeita.';
    modal.classList.add('show');
  });

  document.getElementById('btn-new-char').addEventListener('click', () => {
    modalMode = 'new';
    document.getElementById('modal-icon').textContent = '✨';
    document.getElementById('modal-title').textContent = 'Novo Personagem?';
    document.getElementById('modal-text').textContent = 'Os dados atuais serão perdidos. Deseja criar um novo personagem?';
    modal.classList.add('show');
  });

  btnCancel.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if (e.target===modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') modal.classList.remove('show'); });

  btnConfirm.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    appData = defaultData();
    modal.classList.remove('show');
    if (modalMode === 'new') {
      showCreation();
    } else {
      // Limpar DOM dinâmico para forçar re-render
      const stList = document.getElementById('saving-throws-list');
      const ppList = document.getElementById('prof-pericias-list');
      if (stList) { stList.innerHTML=''; delete stList.dataset.built; }
      if (ppList) { ppList.innerHTML=''; delete ppList.dataset.built; }
      renderAll();
      showToast();
    }
  });
}

/* ─────────────────────────────────────────────
   RENDER ALL
───────────────────────────────────────────── */
function renderAll() {
  renderPersonagem();
  renderAtributos();
  renderWeapons();
  renderObservacoes();
  renderSavingThrows();
  updateAllAtributosST();
}

/* ─────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────── */
function init() {
  initCreationScreen();
  initTabs();
  bindPersonagem();
  bindAtributos();
  bindEquipamentos();
  bindObservacoes();
  bindReset();

  const saved = loadFromStorage();
  if (saved) {
    appData = saved;
    showApp();
  } else {
    showCreation();
  }

  console.log('%cGrimório do Aventureiro 🐉', 'color:#c9a84c;font-size:1.2rem;font-weight:bold;');
}

document.addEventListener('DOMContentLoaded', init);
