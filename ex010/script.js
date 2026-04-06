/* ============================================================
   GRIMÓRIO DO AVENTUREIRO — D&D 5E Character Sheet
   script.js — lógica, storage e interatividade
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   CONSTANTES & ESTADO
───────────────────────────────────────────── */
const STORAGE_KEY = 'dnd5e_ficha_v1';

/** Estrutura padrão de dados */
const defaultData = () => ({
  personagem: {
    nome: '', raca: '', classe: '',
    vida: '', ca: '', nivel: '', xp: ''
  },
  atributos: {
    forca: '', destreza: '', constituicao: '',
    inteligencia: '', sabedoria: '', carisma: ''
  },
  equipamentos: [],   // [{ id, nome, dano, atributo }]
  observacoes: '',
  pericias: {}        // { acrobacia: true/false, ... }
});

let appData = defaultData();
let saveTimeout = null;

/* ─────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────── */

/** Calcula o modificador de atributo D&D */
function calcMod(value) {
  const v = parseInt(value);
  if (isNaN(v) || v < 1) return null;
  return Math.floor((v - 10) / 2);
}

/** Formata o modificador com sinal */
function formatMod(mod) {
  if (mod === null) return '—';
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Gera um ID único simples */
function genId() {
  return `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Lê valor do localStorage com fallback */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    // Mescla com defaultData para garantir novas chaves
    return {
      personagem:   { ...defaultData().personagem,   ...parsed.personagem },
      atributos:    { ...defaultData().atributos,     ...parsed.atributos },
      equipamentos: Array.isArray(parsed.equipamentos) ? parsed.equipamentos : [],
      observacoes:  typeof parsed.observacoes === 'string' ? parsed.observacoes : '',
      pericias:     (parsed.pericias && typeof parsed.pericias === 'object') ? parsed.pericias : {}
    };
  } catch {
    return defaultData();
  }
}

/** Persiste appData no localStorage */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    showToast();
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

/** Salva com debounce de 600ms */
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveToStorage, 600);
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
let toastTimer = null;

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ─────────────────────────────────────────────
   ABAS (TABS)
───────────────────────────────────────────── */
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 1: PERSONAGEM
───────────────────────────────────────────── */
const personagemFields = ['nome', 'raca', 'classe', 'vida', 'ca', 'nivel', 'xp'];

function renderPersonagem() {
  personagemFields.forEach(field => {
    const el = document.getElementById(field);
    if (el) el.value = appData.personagem[field] || '';
  });
}

function bindPersonagem() {
  personagemFields.forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;

    el.addEventListener('input', () => {
      // Validação básica
      el.classList.remove('invalid');

      if (el.type === 'number') {
        const min = parseInt(el.min);
        const max = parseInt(el.max);
        const val = parseInt(el.value);
        if (el.value !== '' && (isNaN(val) || val < min || (el.max && val > max))) {
          el.classList.add('invalid');
          return;
        }
      }

      appData.personagem[field] = el.value;
      if (field === 'nivel') renderPericias();
      debouncedSave();
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 2: ATRIBUTOS
───────────────────────────────────────────── */
const atributosFields = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];

function renderAtributos() {
  atributosFields.forEach(attr => {
    const input = document.getElementById(attr);
    const modEl = document.getElementById(`mod-${attr}`);
    if (!input) return;

    const val = appData.atributos[attr] || '';
    input.value = val;
    updateMod(modEl, val);
  });
}

function updateMod(modEl, value) {
  if (!modEl) return;
  const mod = calcMod(value);
  modEl.textContent = formatMod(mod);

  modEl.classList.remove('positive', 'negative');
  if (mod !== null) {
    if (mod > 0) modEl.classList.add('positive');
    else if (mod < 0) modEl.classList.add('negative');
  }
}

function bindAtributos() {
  atributosFields.forEach(attr => {
    const input = document.getElementById(attr);
    const modEl = document.getElementById(`mod-${attr}`);
    if (!input) return;

    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const v = parseInt(input.value);

      if (input.value !== '' && (isNaN(v) || v < 1 || v > 30)) {
        input.classList.add('invalid');
        return;
      }

      appData.atributos[attr] = input.value;
      updateMod(modEl, input.value);
      renderPericias();
      debouncedSave();
    });
  });
}

/* ─────────────────────────────────────────────
   ABA 3: EQUIPAMENTOS / ARMAS
───────────────────────────────────────────── */
function renderWeapons() {
  const list  = document.getElementById('weapons-list');
  const empty = document.getElementById('empty-weapons');

  list.innerHTML = '';

  if (appData.equipamentos.length === 0) {
    empty.style.display = 'flex';
  } else {
    empty.style.display = 'none';
    appData.equipamentos.forEach((weapon, index) => {
      list.appendChild(createWeaponCard(weapon, index));
    });
  }
}

function createWeaponCard(weapon, index) {
  const card = document.createElement('div');
  card.classList.add('weapon-card');
  card.dataset.id = weapon.id;

  card.innerHTML = `
    <div class="weapon-card-header">
      <span class="weapon-num">Arma ${index + 1}</span>
      <span class="weapon-title">${escapeHtml(weapon.nome) || 'Sem nome'}</span>
      <button class="btn-remove-weapon" type="button" aria-label="Remover arma ${index + 1}" title="Remover arma">✕</button>
    </div>
    <div class="weapon-fields">
      <div class="field">
        <label for="w-nome-${weapon.id}">Nome</label>
        <input
          type="text"
          id="w-nome-${weapon.id}"
          value="${escapeHtml(weapon.nome)}"
          placeholder="Ex: Espada Longa"
          maxlength="40"
          data-field="nome"
          data-id="${weapon.id}"
        />
      </div>
      <div class="field">
        <label for="w-dano-${weapon.id}">Dano</label>
        <input
          type="text"
          id="w-dano-${weapon.id}"
          value="${escapeHtml(weapon.dano)}"
          placeholder="Ex: 1d8"
          maxlength="20"
          data-field="dano"
          data-id="${weapon.id}"
        />
      </div>
      <div class="field">
        <label for="w-attr-${weapon.id}">Atributo</label>
        <select id="w-attr-${weapon.id}" data-field="atributo" data-id="${weapon.id}">
          <option value="forca"    ${weapon.atributo === 'forca'    ? 'selected' : ''}>Força</option>
          <option value="destreza" ${weapon.atributo === 'destreza' ? 'selected' : ''}>Destreza</option>
        </select>
      </div>
    </div>
  `;

  // Botão remover
  card.querySelector('.btn-remove-weapon').addEventListener('click', () => {
    removeWeapon(weapon.id);
  });

  // Inputs da arma
  card.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      const field = el.dataset.field;
      const id    = el.dataset.id;
      updateWeaponField(id, field, el.value);
    });
    el.addEventListener('change', () => {
      const field = el.dataset.field;
      const id    = el.dataset.id;
      updateWeaponField(id, field, el.value);
    });
  });

  return card;
}

function addWeapon() {
  const newWeapon = {
    id:       genId(),
    nome:     '',
    dano:     '',
    atributo: 'forca'
  };
  appData.equipamentos.push(newWeapon);
  saveToStorage();
  renderWeapons();

  // Foca no campo nome da nova arma
  requestAnimationFrame(() => {
    const newInput = document.querySelector(`[id^="w-nome-${newWeapon.id}"]`);
    if (newInput) newInput.focus();
  });
}

function removeWeapon(id) {
  appData.equipamentos = appData.equipamentos.filter(w => w.id !== id);
  saveToStorage();
  renderWeapons();
}

function updateWeaponField(id, field, value) {
  const weapon = appData.equipamentos.find(w => w.id === id);
  if (!weapon) return;
  weapon[field] = value;

  // Atualiza título do card em tempo real
  if (field === 'nome') {
    const card = document.querySelector(`.weapon-card[data-id="${id}"]`);
    if (card) {
      const titleEl = card.querySelector('.weapon-title');
      if (titleEl) titleEl.textContent = value || 'Sem nome';
    }
  }

  debouncedSave();
}

function bindEquipamentos() {
  document.getElementById('btn-add-weapon').addEventListener('click', addWeapon);
}

/* ─────────────────────────────────────────────
   ABA 4: OBSERVAÇÕES
───────────────────────────────────────────── */
function renderObservacoes() {
  const ta = document.getElementById('observacoes');
  if (!ta) return;
  ta.value = appData.observacoes || '';
  updateCharCount(ta.value.length);
}

function bindObservacoes() {
  const ta       = document.getElementById('observacoes');
  const counter  = document.getElementById('char-count');
  if (!ta) return;

  ta.addEventListener('input', () => {
    appData.observacoes = ta.value;
    updateCharCount(ta.value.length);
    debouncedSave();
  });
}

function updateCharCount(n) {
  const el = document.getElementById('char-count');
  if (el) el.textContent = n.toLocaleString('pt-BR');
}

/* ─────────────────────────────────────────────
   RESET / MODAL
───────────────────────────────────────────── */
function bindReset() {
  const btnReset   = document.getElementById('btn-reset');
  const modal      = document.getElementById('modal-reset');
  const btnCancel  = document.getElementById('btn-cancel-reset');
  const btnConfirm = document.getElementById('btn-confirm-reset');

  btnReset.addEventListener('click', () => {
    modal.classList.add('show');
  });

  btnCancel.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Fechar clicando fora do modal
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // Fechar com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });

  btnConfirm.addEventListener('click', () => {
    appData = defaultData();
    localStorage.removeItem(STORAGE_KEY);
    modal.classList.remove('show');
    renderAll();
    showToast();
  });
}

/* ─────────────────────────────────────────────
   ABA 5: PERÍCIAS
───────────────────────────────────────────── */

/** Definição completa das perícias D&D 5E */
const PERICIAS_DEF = [
  {
    grupo: 'Força', atributo: 'forca', rune: 'ᚠ',
    pericias: [
      { id: 'atletismo', nome: 'Atletismo' }
    ]
  },
  {
    grupo: 'Destreza', atributo: 'destreza', rune: 'ᚢ',
    pericias: [
      { id: 'acrobacia',       nome: 'Acrobacia' },
      { id: 'furtividade',     nome: 'Furtividade' },
      { id: 'prestidigitacao', nome: 'Prestidigitação' }
    ]
  },
  {
    grupo: 'Inteligência', atributo: 'inteligencia', rune: 'ᛁ',
    pericias: [
      { id: 'arcanismo',   nome: 'Arcanismo' },
      { id: 'historia',    nome: 'História' },
      { id: 'investigacao',nome: 'Investigação' },
      { id: 'natureza',    nome: 'Natureza' },
      { id: 'religiao',    nome: 'Religião' }
    ]
  },
  {
    grupo: 'Sabedoria', atributo: 'sabedoria', rune: 'ᛊ',
    pericias: [
      { id: 'percepcao',        nome: 'Percepção' },
      { id: 'intuicao',         nome: 'Intuição' },
      { id: 'medicina',         nome: 'Medicina' },
      { id: 'sobrevivencia',    nome: 'Sobrevivência' },
      { id: 'adestrar_animais', nome: 'Adestrar Animais' }
    ]
  },
  {
    grupo: 'Carisma', atributo: 'carisma', rune: 'ᛏ',
    pericias: [
      { id: 'enganacao',    nome: 'Enganação' },
      { id: 'intimidacao',  nome: 'Intimidação' },
      { id: 'persuasao',    nome: 'Persuasão' },
      { id: 'atuacao',      nome: 'Atuação' }
    ]
  }
];

/** Bônus de proficiência por nível */
function getProfBonus(nivel) {
  const n = parseInt(nivel) || 1;
  if (n <= 4)  return 2;
  if (n <= 8)  return 3;
  if (n <= 12) return 4;
  if (n <= 16) return 5;
  return 6;
}

/** Calcula modificador final de uma perícia */
function calcSkillMod(atributo, proficiente, nivel) {
  const attrVal = parseInt(appData.atributos[atributo]) || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const bonus   = proficiente ? getProfBonus(nivel) : 0;
  return attrMod + bonus;
}

/** Formata tooltip explicativo */
function buildTooltip(atributo, proficiente, nivel) {
  const attrVal = parseInt(appData.atributos[atributo]) || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const prof    = getProfBonus(nivel);
  const modStr  = attrMod >= 0 ? `+${attrMod}` : `${attrMod}`;
  if (proficiente) {
    return `${modStr} (${atributo}) + ${prof} (prof) = ${formatMod(attrMod + prof)}`;
  }
  return `${modStr} (${atributo}) sem proficiência`;
}

/** Atualiza o display do bônus de proficiência no topo da aba */
function updateProfBonusDisplay() {
  const nivel = appData.personagem.nivel || 1;
  const bonus = getProfBonus(nivel);
  const bonusEl = document.getElementById('prof-bonus-display');
  const nivelEl = document.getElementById('prof-nivel-display');
  if (bonusEl) bonusEl.textContent = `+${bonus}`;
  if (nivelEl) nivelEl.textContent = parseInt(nivel) || 1;
}

/** Renderiza (ou re-renderiza) todos os modificadores sem recriar o DOM */
function renderPericias() {
  updateProfBonusDisplay();

  const container = document.getElementById('pericias-list');
  if (!container) return;

  const nivel = appData.personagem.nivel || 1;

  // Se ainda não foi renderizado, cria a estrutura toda
  if (!container.dataset.built) {
    container.innerHTML = '';

    PERICIAS_DEF.forEach(group => {
      const attrVal = parseInt(appData.atributos[group.atributo]) || 10;
      const attrMod = Math.floor((attrVal - 10) / 2);

      const groupEl = document.createElement('div');
      groupEl.classList.add('skill-group');
      groupEl.dataset.grupo = group.atributo;

      // Cabeçalho do grupo
      groupEl.innerHTML = `
        <div class="skill-group-header">
          <span class="skill-group-rune">${group.rune}</span>
          <span class="skill-group-name">${group.grupo}</span>
          <span class="skill-group-mod" id="sgmod-${group.atributo}">${formatMod(attrMod)}</span>
        </div>
      `;

      // Linhas de perícia
      group.pericias.forEach(skill => {
        const isProficient = !!appData.pericias[skill.id];
        const mod = calcSkillMod(group.atributo, isProficient, nivel);
        const modStr = formatMod(mod);

        const row = document.createElement('div');
        row.classList.add('skill-row');
        row.dataset.skillId  = skill.id;
        row.dataset.atributo = group.atributo;
        if (isProficient) row.classList.add('proficient');

        row.innerHTML = `
          <input
            type="checkbox"
            class="skill-checkbox"
            id="skill-${skill.id}"
            aria-label="Proficiência em ${skill.nome}"
            ${isProficient ? 'checked' : ''}
          />
          <label class="skill-name" for="skill-${skill.id}">${skill.nome}</label>
          <span class="skill-prof-tag">PROF</span>
          <span class="skill-mod ${mod > 0 ? 'positive' : mod < 0 ? 'negative' : 'zero'}"
                id="skmod-${skill.id}">${modStr}</span>
          <span class="skill-tooltip" id="sktt-${skill.id}">${buildTooltip(group.atributo, isProficient, nivel)}</span>
        `;

        // Evento de checkbox
        const checkbox = row.querySelector('.skill-checkbox');
        checkbox.addEventListener('change', () => {
          appData.pericias[skill.id] = checkbox.checked;
          row.classList.toggle('proficient', checkbox.checked);
          updateSingleSkill(skill.id, group.atributo);
          debouncedSave();
        });

        groupEl.appendChild(row);
      });

      container.appendChild(groupEl);
    });

    container.dataset.built = '1';

  } else {
    // DOM já existe: apenas atualiza os valores
    PERICIAS_DEF.forEach(group => {
      // Atualiza mod do grupo
      const attrVal = parseInt(appData.atributos[group.atributo]) || 10;
      const attrMod = Math.floor((attrVal - 10) / 2);
      const sgMod = document.getElementById(`sgmod-${group.atributo}`);
      if (sgMod) sgMod.textContent = formatMod(attrMod);

      group.pericias.forEach(skill => {
        updateSingleSkill(skill.id, group.atributo);
      });
    });
  }
}

/** Atualiza apenas um skill row (mod + tooltip + classes) */
function updateSingleSkill(skillId, atributo) {
  const nivel = appData.personagem.nivel || 1;
  const isProficient = !!appData.pericias[skillId];
  const mod = calcSkillMod(atributo, isProficient, nivel);
  const modStr = formatMod(mod);

  const modEl = document.getElementById(`skmod-${skillId}`);
  const ttEl  = document.getElementById(`sktt-${skillId}`);

  if (modEl) {
    const prev = modEl.textContent;
    if (prev !== modStr) {
      modEl.textContent = modStr;
      modEl.className = `skill-mod ${mod > 0 ? 'positive' : mod < 0 ? 'negative' : 'zero'}`;
      if (isProficient) modEl.classList.add('proficient-val');
      // Animação de bump ao mudar
      modEl.classList.remove('bump');
      void modEl.offsetWidth; // reflow
      modEl.classList.add('bump');
    }
  }

  if (ttEl) {
    ttEl.textContent = buildTooltip(atributo, isProficient, nivel);
  }
}

/* ─────────────────────────────────────────────
   RENDER ALL
───────────────────────────────────────────── */
function renderAll() {
  renderPersonagem();
  renderAtributos();
  renderWeapons();
  renderObservacoes();
  renderPericias();
}

/* ─────────────────────────────────────────────
   SEGURANÇA: escape HTML
───────────────────────────────────────────── */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────── */
function init() {
  appData = loadFromStorage();

  initTabs();

  bindPersonagem();
  bindAtributos();
  bindEquipamentos();
  bindObservacoes();
  bindReset();

  renderAll();

  console.log('%cGrimório do Aventureiro 🐉', 'color: #c9a84c; font-size: 1.2rem; font-weight: bold;');
  console.log('%cFicha D&D 5E carregada com sucesso!', 'color: #7c5cbf;');
}

document.addEventListener('DOMContentLoaded', init);
