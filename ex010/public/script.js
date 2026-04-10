/* ============================================================
   GRIMÓRIO DO AVENTUREIRO — D&D 5E SRD Completo
   script.js  — v6.0  (ficha definitiva para mesa)
   ============================================================ */
'use strict';

/* ═══════════════════════════════════════════════════════════
   DADOS SRD — RAÇAS
═══════════════════════════════════════════════════════════ */
const RACAS_DATA = {
  humano:    { nome:'Humano',     icon:'🧑', descricao:'Versáteis e ambiciosos. +1 em TODOS os atributos.', deslocamento:30, idiomas:['Comum'],
               bonusAtributos:{forca:1,destreza:1,constituicao:1,inteligencia:1,sabedoria:1,carisma:1},
               vantagens:['Bônus em todos os atributos','Talento extra (variante)','Proficiência extra em uma habilidade'], subraces:{} },
  elfo:      { nome:'Elfo',       icon:'🧝', descricao:'Graciosos e imortais. +2 Destreza.', deslocamento:30, idiomas:['Comum','Élfico'],
               bonusAtributos:{destreza:2},
               vantagens:['Visão no escuro 60 pés','Imune a sono mágico','Vantagem vs. encantamento','Transe (não precisa dormir)'],
               subraces:{
                 alto_elfo:     {nome:'Alto Elfo',          descricao:'+1 INT. Truque de mago e idioma extra.', bonusAtributos:{inteligencia:1}, vantagens:['Truque de mago (INT)','Proficiência: espada longa, arco longo','Idioma extra']},
                 elfo_floresta: {nome:'Elfo da Floresta',   descricao:'+1 SAB. Deslocamento 35 pés.',           bonusAtributos:{sabedoria:1},    vantagens:['Deslocamento 35 pés','Máscara das Terras Selvagens']},
                 drow:          {nome:'Elfo Negro (Drow)',  descricao:'+1 CAR. Visão superior e magia Drow.',   bonusAtributos:{carisma:1},      vantagens:['Visão no escuro 120 pés','Magia Drow (Luz das Fadas, Escuridão)','Sensibilidade à Luz Solar']},
               }},
  anao:      { nome:'Anão',       icon:'⛏️', descricao:'Resistentes e determinados. +2 Constituição.', deslocamento:25, idiomas:['Comum','Anão'],
               bonusAtributos:{constituicao:2},
               vantagens:['Resistência a veneno','Visão no escuro 60 pés','Treinamento com armas Anãs','Especialização em Rochas'],
               subraces:{
                 anao_colina:   {nome:'Anão da Colina',    descricao:'+1 SAB. +1 PV por nível.',             bonusAtributos:{sabedoria:1},    vantagens:['+1 PV por nível','Proficiência em Percepção']},
                 anao_montanha: {nome:'Anão da Montanha',  descricao:'+2 FOR. Proficiência com armaduras.',  bonusAtributos:{forca:2},        vantagens:['Proficiência com armaduras leves e médias']},
               }},
  halfling:  { nome:'Halfling',   icon:'🏡', descricao:'Pequenos e sortudos. +2 Destreza.', deslocamento:25, idiomas:['Comum','Halfling'],
               bonusAtributos:{destreza:2},
               vantagens:['Sortudo (relança 1s em d20)','Corajoso (vantagem vs. medo)','Agilidade Halfling'],
               subraces:{
                 pes_leves:     {nome:'Pés-Leves',  descricao:'+1 CAR. Furtividade natural.', bonusAtributos:{carisma:1},      vantagens:['Furtividade Natural']},
                 robusto:       {nome:'Robusto',    descricao:'+1 CON. Resistência a veneno.', bonusAtributos:{constituicao:1}, vantagens:['Resistência a veneno','Vantagem em saves vs. veneno']},
               }},
  draconato: { nome:'Draconato',  icon:'🐉', descricao:'Descendentes de dragões. +2 FOR, +1 CAR.', deslocamento:30, idiomas:['Comum','Dracônico'],
               bonusAtributos:{forca:2,carisma:1},
               vantagens:['Sopro de Dragão (baseado na linhagem)','Resistência elemental','Aspecto dracônico'], subraces:{} },
  gnomo:     { nome:'Gnomo',      icon:'🔮', descricao:'Curiosos e inventivos. +2 Inteligência.', deslocamento:25, idiomas:['Comum','Gnômico'],
               bonusAtributos:{inteligencia:2},
               vantagens:['Astúcia Gnômica (vantagem vs. magia INT/SAB/CAR)','Visão no escuro 60 pés'],
               subraces:{
                 gnomo_floresta:{nome:'Gnomo da Floresta', descricao:'+1 DES. Ilusão natural e comunicação animal.', bonusAtributos:{destreza:1},     vantagens:['Ilusionista Natural (Ilusão Menor)','Falar com Pequenos Animais']},
                 gnomo_rochas:  {nome:'Gnomo das Rochas',  descricao:'+1 CON. Ferramenta de tinker.',             bonusAtributos:{constituicao:1}, vantagens:['Ferramenta de tinker','Conhecimento de construtos mágicos']},
               }},
  meio_elfo: { nome:'Meio-Elfo',  icon:'🌗', descricao:'O melhor das duas heranças. +2 CAR + 2 outros.', deslocamento:30, idiomas:['Comum','Élfico'],
               bonusAtributos:{carisma:2},
               vantagens:['+1 em dois atributos à escolha','Visão no escuro 60 pés','Resistência a encantamentos','Versatilidade: 2 proficiências extras'], subraces:{} },
  meio_orc:  { nome:'Meio-Orc',   icon:'💪', descricao:'Força bruta e determinação. +2 FOR, +1 CON.', deslocamento:30, idiomas:['Comum','Orc'],
               bonusAtributos:{forca:2,constituicao:1},
               vantagens:['Visão no escuro 60 pés','Ameaçador (prof. Intimidação)','Resistência Implacável (1×/descanso longo)','Ataques Selvagens'], subraces:{} },
  tiefling:  { nome:'Tiefling',   icon:'😈', descricao:'Marca infernal. +1 INT, +2 CAR.', deslocamento:30, idiomas:['Comum','Infernal'],
               bonusAtributos:{inteligencia:1,carisma:2},
               vantagens:['Visão no escuro 60 pés','Resistência a fogo','Herança Infernal (Taumaturgia, Chamas Infernais, Escuridão)'], subraces:{} },
};

/* ═══════════════════════════════════════════════════════════
   DADOS SRD — CLASSES
═══════════════════════════════════════════════════════════ */
const CLASSES_DATA = {
  barbaro:     { nome:'Bárbaro',     dice:'d12', vidaBase:12, atributoConjurador:null,
    descricao:'Guerreiro primitivo impulsionado pela fúria.',
    savingThrows:['forca','constituicao'],
    periciasBase:['atletismo','intimidacao','percepcao','sobrevivencia','natureza','adestrar_animais'],
    vantagens:['Fúria (dano extra + resistência a dano físico)','Defesa sem Armadura (10+DES+CON)','Ataque Descuidado','Sentido de Perigo','Movimento Extra (nível 5)'] },
  bardo:       { nome:'Bardo',       dice:'d8',  vidaBase:8,  atributoConjurador:'carisma',
    descricao:'Artista e mago versátil. Inspiração para aliados.',
    savingThrows:['destreza','carisma'],
    periciasBase:['acrobacia','atletismo','enganacao','historia','intuicao','intimidacao','investigacao','medicina','percepcao','persuasao','atuacao','furtividade'],
    vantagens:['Inspiração Bárdica','Canção de Descanso','Expertise (dobra prof.)','Segredos Mágicos'] },
  clerigo:     { nome:'Clérigo',     dice:'d8',  vidaBase:8,  atributoConjurador:'sabedoria',
    descricao:'Campeão divino. Cura, protege e destrói.',
    savingThrows:['sabedoria','carisma'],
    periciasBase:['historia','intuicao','medicina','persuasao','religiao'],
    vantagens:['Canalizar Divindade','Expulsar Mortos-Vivos','Domínio Divino','Intervenção Divina'] },
  druida:      { nome:'Druida',      dice:'d8',  vidaBase:8,  atributoConjurador:'sabedoria',
    descricao:'Guardião da natureza. Forma Selvagem e magia primordial.',
    savingThrows:['inteligencia','sabedoria'],
    periciasBase:['arcanismo','adestrar_animais','intuicao','medicina','natureza','percepcao','religiao','sobrevivencia'],
    vantagens:['Forma Selvagem','Ritual Druídico','Passo Florestal','Mente Atemporal'] },
  guerreiro:   { nome:'Guerreiro',   dice:'d10', vidaBase:10, atributoConjurador:null,
    descricao:'Mestre das armas e armaduras.',
    savingThrows:['forca','constituicao'],
    periciasBase:['acrobacia','atletismo','historia','intuicao','intimidacao','percepcao','sobrevivencia'],
    vantagens:['Segundo Fôlego','Surto de Ação','Estilo de Combate','Ataque Extra (nível 5)'] },
  monge:       { nome:'Monge',       dice:'d8',  vidaBase:8,  atributoConjurador:null,
    descricao:'Artista marcial que canaliza ki para feitos sobre-humanos.',
    savingThrows:['forca','destreza'],
    periciasBase:['acrobacia','atletismo','historia','intuicao','religiao','furtividade'],
    vantagens:['Defesa sem Armadura (10+DES+SAB)','Artes Marciais','Ki','Queda Lenta','Golpe Atordoante'] },
  paladino:    { nome:'Paladino',    dice:'d10', vidaBase:10, atributoConjurador:'carisma',
    descricao:'Guerreiro sagrado. Combate e magia divina.',
    savingThrows:['sabedoria','carisma'],
    periciasBase:['atletismo','intuicao','intimidacao','medicina','persuasao','religiao'],
    vantagens:['Sentido Divino','Imposição de Mãos','Smite Divino','Aura de Proteção','Juramento Sagrado'] },
  patrulheiro: { nome:'Patrulheiro', dice:'d10', vidaBase:10, atributoConjurador:'sabedoria',
    descricao:'Caçador e rastreador mágico.',
    savingThrows:['forca','destreza'],
    periciasBase:['adestrar_animais','atletismo','intuicao','investigacao','natureza','percepcao','furtividade','sobrevivencia'],
    vantagens:['Inimigo Favorito','Explorador Natural','Companheiro Animal','Ataque Oculto'] },
  ladino:      { nome:'Ladino',      dice:'d8',  vidaBase:8,  atributoConjurador:null,
    descricao:'Mestre das sombras, furtividade e ataques precisos.',
    savingThrows:['destreza','inteligencia'],
    periciasBase:['acrobacia','atletismo','enganacao','intuicao','intimidacao','investigacao','percepcao','atuacao','persuasao','furtividade','prestidigitacao'],
    vantagens:['Ataque Furtivo','Jargão dos Ladrões','Esquiva Ágil','Expertise','Reflexos Trapaceiros'] },
  feiticeiro:  { nome:'Feiticeiro',  dice:'d6',  vidaBase:6,  atributoConjurador:'carisma',
    descricao:'Magia inata que flui do sangue.',
    savingThrows:['constituicao','carisma'],
    periciasBase:['arcanismo','enganacao','intuicao','intimidacao','persuasao','religiao'],
    vantagens:['Origem de Feitiçaria','Pontos de Feitiçaria','Metamagia','Restauração de Feitiçaria'] },
  bruxo:       { nome:'Bruxo',       dice:'d8',  vidaBase:8,  atributoConjurador:'carisma',
    descricao:'Magia por pacto com um patrono poderoso.',
    savingThrows:['sabedoria','carisma'],
    periciasBase:['arcanismo','enganacao','historia','intimidacao','investigacao','natureza','religiao'],
    vantagens:['Patrono Transcendental','Pacto Mágico','Invocações Éldricas','Slots por descanso curto'] },
  mago:        { nome:'Mago',        dice:'d6',  vidaBase:6,  atributoConjurador:'inteligencia',
    descricao:'Estudioso supremo da magia arcana.',
    savingThrows:['inteligencia','sabedoria'],
    periciasBase:['arcanismo','historia','intuicao','investigacao','medicina','religiao'],
    vantagens:['Grimório de magias','Recuperação Arcana','Tradição Arcana','Maestria em Feitiços'] },
};

/* Slots de magia por nível de personagem (conjuradores completos) */
const SPELL_SLOTS = {
  1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2],6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],
  9:[4,3,3,3,1],10:[4,3,3,3,2],11:[4,3,3,3,2,1],12:[4,3,3,3,2,1],
  13:[4,3,3,3,2,1,1],14:[4,3,3,3,2,1,1],15:[4,3,3,3,2,1,1,1],
  16:[4,3,3,3,2,1,1,1],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1],
};
/* Bruxo usa 1-4 slots iguais por descanso curto */
const WARLOCK_SLOTS = {1:1,2:2,3:2,4:2,5:3,6:3,7:4,8:4,9:4,10:4,11:3,12:3,13:3,14:3,15:3,16:3,17:4,18:4,19:4,20:4};

/* ═══════════════════════════════════════════════════════════
   DADOS SRD — ANTECEDENTES
═══════════════════════════════════════════════════════════ */
const BACKGROUNDS_DATA = {
  acolito:    { nome:'Acólito',            descricao:'Serviçal de um templo ou panteão.',           caracteristica:'Abrigo dos Fiéis — templos de sua fé oferecem hospedagem e cura gratuita.',    pericias:['intuicao','religiao'],          idiomas:['Dois à escolha'], equipamento:'Símbolo sagrado, livro de preces, 5 varetas de incenso, vestimentas, 15 po' },
  artesao:    { nome:'Artesão da Guilda',  descricao:'Membro respeitado de uma guilda de artesãos.',caracteristica:'Associados da Guilda — hospedagem, funeral e suporte político da guilda.',      pericias:['historia','persuasao'],         idiomas:['Um à escolha'],   equipamento:'Ferramentas de artesão, carta da guilda, roupas de viajante, 15 po' },
  criminoso:  { nome:'Criminoso/Espião',   descricao:'Vida no lado errado da lei.',                  caracteristica:'Contato Criminal — um contato confiável no submundo.',                          pericias:['enganacao','furtividade'],      idiomas:[],                 equipamento:'Pé-de-cabra, roupas escuras, capuz, bolsa com 15 po' },
  eremita:    { nome:'Eremita',            descricao:'Vida de isolamento e contemplação.',           caracteristica:'Descoberta — descobriu algo de grande importância durante o isolamento.',       pericias:['medicina','religiao'],          idiomas:['Um à escolha'],   equipamento:'Estojo com ervas medicinais, diário, manto de inverno, 5 po' },
  forasteiro: { nome:'Forasteiro',         descricao:'Cresceu nas terras selvagens.',                caracteristica:'Andarilho — lembra de mapas de territórios que já percorreu.',                 pericias:['atletismo','sobrevivencia'],    idiomas:['Um à escolha'],   equipamento:'Bastão, armadilha, trofeu de animais, roupas de viajante, 10 po' },
  heroi_povo: { nome:'Herói do Povo',      descricao:'Origem humilde com destino heroico.',          caracteristica:'Hospitalidade Rústica — pessoas comuns o acolhem como um igual.',              pericias:['adestrar_animais','sobrevivencia'], idiomas:[],             equipamento:'Pá, panela de ferro, roupas comuns, 10 po' },
  marinheiro: { nome:'Marinheiro',         descricao:'Anos nos mares enfrentando tempestades.',     caracteristica:'Passagem de Navio — livre acesso em navios amigos.',                           pericias:['atletismo','percepcao'],        idiomas:[],                 equipamento:'Cassetete, 50 pés de seda, talismã de boa sorte, roupas comuns, 10 po' },
  membro_cla: { nome:'Membro de Clã',      descricao:'Tradições de um clã de anões.',               caracteristica:'Hospitalidade de Clã — clãs anões o recebem com boa vontade.',                pericias:['historia','percepcao'],         idiomas:['Um à escolha'],   equipamento:'Armas de trabalho de artesão, roupa viajante, carta do clã, 10 po' },
  nobre:      { nome:'Nobre',              descricao:'Nasceu com riqueza e privilégios.',            caracteristica:'Posição de Privilégio — pessoas ricas e poderosas consideram a você um par.',  pericias:['historia','persuasao'],         idiomas:['Um à escolha'],   equipamento:'Roupas finas, sinete, pergaminho de linhagem, 25 po' },
  sabio:      { nome:'Sábio',              descricao:'Passou a vida estudando em bibliotecas.',      caracteristica:'Pesquisador — sabe onde encontrar informação que não possui.',                  pericias:['arcanismo','historia'],         idiomas:['Dois à escolha'], equipamento:'Faca, carta de um colega morto, roupas comuns, 10 po' },
  soldado:    { nome:'Soldado',            descricao:'Serviu em um exército ou milícia.',            caracteristica:'Posição Militar — militares o reconhecem e lhe concedem cortesia.',             pericias:['atletismo','intimidacao'],      idiomas:[],                 equipamento:'Insígnia de patente, trofeu de batalha, dados de osso, roupas comuns, 10 po' },
  ator:       { nome:'Ator/Artista',       descricao:'Cresceu se apresentando para multidões.',     caracteristica:'Por Amor ao Artista — sempre encontra lugar para se apresentar.',              pericias:['acrobacia','atuacao'],          idiomas:[],                 equipamento:'Instrumento musical, presente de fã, fantasia, 15 po' },
};

/* ═══════════════════════════════════════════════════════════
   TABELA DE ARMADURAS
═══════════════════════════════════════════════════════════ */
const ARMOR_DATA = {
  sem_armadura:      { nome:'Sem Armadura',         tipo:'nenhuma', base:10, maxDex:99,  forMin:0  },
  gibao_couro:       { nome:'Gibão de Couro',        tipo:'leve',    base:11, maxDex:99,  forMin:0  },
  couro:             { nome:'Couro',                 tipo:'leve',    base:11, maxDex:99,  forMin:0  },
  couro_batido:      { nome:'Couro Batido',          tipo:'leve',    base:12, maxDex:99,  forMin:0  },
  pele:              { nome:'Pele',                  tipo:'media',   base:12, maxDex:2,   forMin:0  },
  cota_aneis:        { nome:'Cota de Anéis',         tipo:'media',   base:13, maxDex:2,   forMin:0  },
  cota_escamas:      { nome:'Cota de Escamas',       tipo:'media',   base:14, maxDex:2,   forMin:0  },
  peitoral:          { nome:'Peitoral',              tipo:'media',   base:14, maxDex:2,   forMin:0  },
  meia_armadura:     { nome:'Meia Armadura',         tipo:'media',   base:15, maxDex:2,   forMin:0  },
  cota_correntes:    { nome:'Cota de Correntes',     tipo:'pesada',  base:16, maxDex:0,   forMin:13 },
  armadura_laminas:  { nome:'Armadura de Lâminas',   tipo:'pesada',  base:17, maxDex:0,   forMin:15 },
  armadura_placas:   { nome:'Armadura de Placas',    tipo:'pesada',  base:18, maxDex:0,   forMin:15 },
  barbaro:           { nome:'Def. Bárbaro',          tipo:'especial',base:10, maxDex:99,  forMin:0,  extra:'con' },
  monge:             { nome:'Def. Monge',            tipo:'especial',base:10, maxDex:99,  forMin:0,  extra:'sab' },
};

/* ═══════════════════════════════════════════════════════════
   CONDIÇÕES
═══════════════════════════════════════════════════════════ */
const CONDITIONS_LIST = [
  {id:'agarrado',     nome:'Agarrado',      icon:'🤜', desc:'Deslocamento 0. Ataques contra você não têm vantagem/desv.'},
  {id:'amedrontado',  nome:'Amedrontado',   icon:'😨', desc:'Desvantagem em testes e ataques enquanto a fonte do medo estiver visível.'},
  {id:'asfixiando',   nome:'Asfixiando',    icon:'💨', desc:'Pode usar a ação para sobreviver. Falha → 0 PV.'},
  {id:'atordoado',    nome:'Atordoado',     icon:'💫', desc:'Incapacitado, não pode mover, saves de STR/DEX com desv.'},
  {id:'caido',        nome:'Caído',         icon:'⬇️', desc:'Ataques corpo-a-corpo com vantagem. Ataques à distância com desvantagem.'},
  {id:'cego',         nome:'Cego',          icon:'👁️', desc:'Falha em testes de visão. Ataques com desvantagem, ataques vs. você com vantagem.'},
  {id:'enfeitizado',  nome:'Enfeitiçado',   icon:'💜', desc:'Não pode atacar o enfeitiçador. Ele tem vantagem em testes sociais vs. você.'},
  {id:'envenenado',   nome:'Envenenado',    icon:'☠️', desc:'Desvantagem em ataques e testes de habilidade.'},
  {id:'incapacitado', nome:'Incapacitado',  icon:'🚫', desc:'Não pode usar ações nem reações.'},
  {id:'invisivel',    nome:'Invisível',     icon:'👻', desc:'Ataques seus com vantagem. Ataques vs. você com desvantagem.'},
  {id:'paralisado',   nome:'Paralisado',    icon:'❄️', desc:'Incapacitado, não pode mover. Ataques corpo-a-corpo são críticos automáticos.'},
  {id:'petrificado',  nome:'Petrificado',   icon:'🗿', desc:'Transformado em substância inanimeada. Incapacitado, resistência a todos danos.'},
  {id:'surdo',        nome:'Surdo',         icon:'🔇', desc:'Falha em testes que dependem de audição.'},
];

const EXHAUSTION_EFFECTS = [
  'Sem exaustão — personagem em plenas condições.',
  'Nível 1 — Desvantagem em testes de habilidade.',
  'Nível 2 — Deslocamento reduzido à metade.',
  'Nível 3 — Desvantagem em ataques e testes de resistência.',
  'Nível 4 — Máximo de PV reduzido à metade.',
  'Nível 5 — Deslocamento reduzido a 0.',
  'Nível 6 — Morte.',
];

/* ═══════════════════════════════════════════════════════════
   TABELA XP / PROGRESSÃO
═══════════════════════════════════════════════════════════ */
const XP_TABLE = [
  {nivel:1, xp:0,       prof:2},{nivel:2,  xp:300,    prof:2},{nivel:3,  xp:900,    prof:2},{nivel:4,  xp:2700,   prof:2},
  {nivel:5, xp:6500,    prof:3},{nivel:6,  xp:14000,  prof:3},{nivel:7,  xp:23000,  prof:3},{nivel:8,  xp:34000,  prof:3},
  {nivel:9, xp:48000,   prof:4},{nivel:10, xp:64000,  prof:4},{nivel:11, xp:85000,  prof:4},{nivel:12, xp:100000, prof:4},
  {nivel:13,xp:120000,  prof:5},{nivel:14, xp:140000, prof:5},{nivel:15, xp:165000, prof:5},{nivel:16, xp:195000, prof:5},
  {nivel:17,xp:225000,  prof:6},{nivel:18, xp:265000, prof:6},{nivel:19, xp:305000, prof:6},{nivel:20, xp:355000, prof:6},
];

/* ═══════════════════════════════════════════════════════════
   PERÍCIAS
═══════════════════════════════════════════════════════════ */
const PERICIAS_DEF = [
  {grupo:'Força',       atributo:'forca',        rune:'ᚠ', pericias:[{id:'atletismo',      nome:'Atletismo'}]},
  {grupo:'Destreza',    atributo:'destreza',     rune:'ᚢ', pericias:[{id:'acrobacia',       nome:'Acrobacia'},{id:'furtividade',nome:'Furtividade'},{id:'prestidigitacao',nome:'Prestidigitação'}]},
  {grupo:'Inteligência',atributo:'inteligencia', rune:'ᛁ', pericias:[{id:'arcanismo',       nome:'Arcanismo'},{id:'historia',nome:'História'},{id:'investigacao',nome:'Investigação'},{id:'natureza',nome:'Natureza'},{id:'religiao',nome:'Religião'}]},
  {grupo:'Sabedoria',   atributo:'sabedoria',    rune:'ᛊ', pericias:[{id:'percepcao',       nome:'Percepção'},{id:'intuicao',nome:'Intuição'},{id:'medicina',nome:'Medicina'},{id:'sobrevivencia',nome:'Sobrevivência'},{id:'adestrar_animais',nome:'Adestrar Animais'}]},
  {grupo:'Carisma',     atributo:'carisma',      rune:'ᛏ', pericias:[{id:'enganacao',       nome:'Enganação'},{id:'intimidacao',nome:'Intimidação'},{id:'persuasao',nome:'Persuasão'},{id:'atuacao',nome:'Atuação'}]},
];

const ST_DEF = [
  {id:'forca',nome:'Força',rune:'ᚠ'},{id:'destreza',nome:'Destreza',rune:'ᚢ'},
  {id:'constituicao',nome:'Constituição',rune:'ᚱ'},{id:'inteligencia',nome:'Inteligência',rune:'ᛁ'},
  {id:'sabedoria',nome:'Sabedoria',rune:'ᛊ'},{id:'carisma',nome:'Carisma',rune:'ᛏ'},
];

/* ═══════════════════════════════════════════════════════════
   CONSTANTES & ESTADO
═══════════════════════════════════════════════════════════ */
const STORAGE_KEY    = 'dnd5e_ficha_v6';
const STANDARD_ARRAY = [15,14,13,12,10,8];
const ATTR_ORDER     = ['forca','destreza','constituicao','inteligencia','sabedoria','carisma'];
const ATTR_META = {
  forca:       {label:'Força',       rune:'ᚠ'},
  destreza:    {label:'Destreza',    rune:'ᚢ'},
  constituicao:{label:'Constituição',rune:'ᚱ'},
  inteligencia:{label:'Inteligência',rune:'ᛁ'},
  sabedoria:   {label:'Sabedoria',   rune:'ᛊ'},
  carisma:     {label:'Carisma',     rune:'ᛏ'},
};

const defaultData = () => ({
  personagem:    {nome:'',raca:'',classe:'',racaId:'',subracaId:'',classeId:'',backgroundId:'',tendencia:''},
  atributos:     {forca:'10',destreza:'10',constituicao:'10',inteligencia:'10',sabedoria:'10',carisma:'10'},
  atributosBase: {forca:'10',destreza:'10',constituicao:'10',inteligencia:'10',sabedoria:'10',carisma:'10'},
  vida:          {atual:0,max:0,temp:0},
  combate:       {nivel:1,xp:0,velocidade:30,armadura:'sem_armadura',escudo:false},
  hitDice:       {total:1,usados:0},
  armas:         [],
  inventario:    [],
  moedas:        {pp:0,po:0,pe:0,pc:0},
  pericias:      {},
  proficiencias: {savingThrows:{}},
  condicoes:     {},
  exaustao:      0,
  resistencias:  [],
  magias:        {atributo:'',slots:[],slotsUsados:[],lista:[]},
  personalidade: {tracos:'',ideais:'',vinculos:'',defeitos:''},
  aparencia:     {idade:'',altura:'',peso:'',olhos:'',cabelo:'',pele:''},
  idiomas:       [],
  background:    {id:''},
  inspiracao:    false,
  observacoes:   '',
});

let appData     = defaultData();
let saveTimeout = null;
const wizState  = {step:1, attrAssign:{forca:'',destreza:'',constituicao:'',inteligencia:'',sabedoria:'',carisma:''}};

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const calcMod   = v => { const n=parseInt(v); return isNaN(n)||n<1?null:Math.floor((n-10)/2); };
const formatMod = m => m===null?'—':m>=0?`+${m}`:`${m}`;
const genId     = () => `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const esc       = s => typeof s!=='string'?'':s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const clamp     = (v,mn,mx) => Math.min(mx,Math.max(mn,v));
const $         = id => document.getElementById(id);
const setEl     = (id,v) => { const e=$(id); if(e) e.textContent=v; };
const setVal    = (id,v) => { const e=$(id); if(e) e.value=v; };

function getProfBonus(nivel) {
  const n=parseInt(nivel)||1;
  if(n<=4)return 2; if(n<=8)return 3; if(n<=12)return 4; if(n<=16)return 5; return 6;
}
function attrLabel(a){ return ATTR_META[a]?.label||a; }
function skillLabel(id){
  const m={atletismo:'Atletismo',acrobacia:'Acrobacia',furtividade:'Furtividade',prestidigitacao:'Prestidigitação',
    arcanismo:'Arcanismo',historia:'História',investigacao:'Investigação',natureza:'Natureza',religiao:'Religião',
    percepcao:'Percepção',intuicao:'Intuição',medicina:'Medicina',sobrevivencia:'Sobrevivência',adestrar_animais:'Adestrar Animais',
    enganacao:'Enganação',intimidacao:'Intimidação',persuasao:'Persuasão',atuacao:'Atuação'};
  return m[id]||id;
}

/* ═══════════════════════════════════════════════════════════
   PERSISTÊNCIA — API + LocalStorage como cache
═══════════════════════════════════════════════════════════ */
let currentCharId = null;  // ID do personagem no banco

function loadFromStorage() {
  // Cache local (fallback offline)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw), d = defaultData();
    return {
      personagem:    {...d.personagem,   ...p.personagem},
      atributos:     {...d.atributos,    ...p.atributos},
      atributosBase: {...d.atributosBase,...(p.atributosBase||p.atributos)},
      vida:          {...d.vida,         ...p.vida},
      combate:       {...d.combate,      ...p.combate},
      hitDice:       {...d.hitDice,      ...p.hitDice},
      armas:         Array.isArray(p.armas)?p.armas:[],
      inventario:    Array.isArray(p.inventario)?p.inventario:[],
      moedas:        {...d.moedas,       ...p.moedas},
      pericias:      p.pericias||{},
      proficiencias: {savingThrows:p.proficiencias?.savingThrows||{}},
      condicoes:     p.condicoes||{},
      exaustao:      p.exaustao||0,
      resistencias:  Array.isArray(p.resistencias)?p.resistencias:[],
      magias:        {...d.magias,       ...p.magias},
      personalidade: {...d.personalidade,...p.personalidade},
      aparencia:     {...d.aparencia,    ...p.aparencia},
      idiomas:       Array.isArray(p.idiomas)?p.idiomas:[],
      background:    {...d.background,   ...p.background},
      inspiracao:    !!p.inspiracao,
      observacoes:   p.observacoes||'',
    };
  } catch(e){ console.warn('Cache load error:',e); return null; }
}

function saveToLocalCache() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); }
  catch(e){ console.warn('Cache save error:',e); }
}

async function saveToServer() {
  if (!window.GrimorioAPI?.Auth.isLoggedIn()) {
    saveToLocalCache(); showToast(); return;
  }
  try {
    const { CharacterAPI } = window.GrimorioAPI;
    currentCharId = await CharacterAPI.save(appData, currentCharId);
    localStorage.setItem('grimorio_current_char_id', currentCharId);
    saveToLocalCache();
    showToast();
  } catch(e) {
    console.warn('Server save error:', e);
    saveToLocalCache(); // fallback to cache
    showToast('⚠️ Salvo localmente (offline)');
  }
}

function debouncedSave(){
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveToServer, 800);
}

// Override saveToStorage to use server
function saveToStorage(){ saveToServer(); }


/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
let toastTimer=null;
function showToast(msg) {
  const t=$('toast');
  if(msg) t.innerHTML = `<span>${msg}</span>`;
  else    t.innerHTML = `<span class="toast-icon">✦</span> Salvo automaticamente`;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ═══════════════════════════════════════════════════════════
   WIZARD DE CRIAÇÃO
═══════════════════════════════════════════════════════════ */
function initWizard(){
  buildAttrAssignUI();
  $('btn-wiz-next').addEventListener('click', wizardNext);
  $('btn-wiz-back').addEventListener('click', wizardBack);
  $('btn-criar').addEventListener('click', handleCriar);
  $('cr-raca').addEventListener('change', onRacaChange);
  $('cr-subraca').addEventListener('change', onSubracaChange);
  $('cr-classe').addEventListener('change', onClasseChange);
  $('cr-background').addEventListener('change', onBgWizard);
  $('cr-nome').addEventListener('input', () => $('cr-nome').closest('.creation-field')?.classList.remove('has-error'));
  updateWizardView();
}

function wizardNext(){ if(validateStep(wizState.step)){ wizState.step++; updateWizardView(); } }
function wizardBack(){ if(wizState.step>1){ wizState.step--; updateWizardView(); } }

function updateWizardView(){
  document.querySelectorAll('.wizard-step-panel').forEach(p=>p.classList.remove('active'));
  $(`wstep-${wizState.step}`)?.classList.add('active');
  $('btn-wiz-back').style.display = wizState.step>1?'':'none';
  $('btn-wiz-next').style.display = wizState.step<4?'':'none';
  $('btn-criar').style.display    = wizState.step===4?'':'none';
  document.querySelectorAll('.wp-step').forEach(el=>{
    const s=parseInt(el.dataset.step);
    el.classList.remove('active','done');
    if(s===wizState.step) el.classList.add('active');
    else if(s<wizState.step) el.classList.add('done');
  });
  document.querySelectorAll('.wp-connector').forEach((el,i)=>el.classList.toggle('done',i+1<wizState.step));
  if(wizState.step===4) refreshAttrAssign();
}

function validateStep(s){
  if(s===1){
    const n=$('cr-nome').value.trim();
    if(!n){$('cr-nome').closest('.creation-field').classList.add('has-error');return false;}
    $('cr-nome').closest('.creation-field').classList.remove('has-error');return true;
  }
  if(s===2){const r=$('cr-raca').value; if(!r){$('cr-raca').closest('.creation-field').classList.add('has-error');return false;} $('cr-raca').closest('.creation-field').classList.remove('has-error');return true;}
  if(s===3){const c=$('cr-classe').value; if(!c){$('cr-classe').closest('.creation-field').classList.add('has-error');return false;} $('cr-classe').closest('.creation-field').classList.remove('has-error');return true;}
  if(s===4){const ok=ATTR_ORDER.every(a=>wizState.attrAssign[a]!==''); $('attr-assign-warning').style.display=ok?'none':'block'; return ok;}
  return true;
}

function onRacaChange(){ updateSubracaOptions(this.value); renderRaceCard(this.value,''); if(wizState.step===4)refreshAttrAssign(); }
function onSubracaChange(){ renderRaceCard($('cr-raca').value,this.value); if(wizState.step===4)refreshAttrAssign(); }

function updateSubracaOptions(racaId){
  const sub=$('cr-subraca'), sf=$('subraca-field');
  const keys=racaId&&RACAS_DATA[racaId]?Object.keys(RACAS_DATA[racaId].subraces):[];
  if(!keys.length){sf.style.display='none';sub.disabled=true;return;}
  sf.style.display=''; sub.disabled=false;
  sub.innerHTML='<option value="">— nenhuma —</option>';
  keys.forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=RACAS_DATA[racaId].subraces[k].nome;sub.appendChild(o);});
}

function renderRaceCard(racaId,subId){
  const card=$('race-info-card');
  if(!racaId||!RACAS_DATA[racaId]){card.style.display='none';return;}
  card.style.display='';
  const raca=RACAS_DATA[racaId], sub=subId?raca.subraces[subId]:null;
  $('ric-icon').textContent=raca.icon;
  $('ric-name').textContent=sub?`${raca.nome} — ${sub.nome}`:raca.nome;
  $('ric-desc').textContent=sub?sub.descricao:raca.descricao;
  const bonuses={...raca.bonusAtributos,...(sub?.bonusAtributos||{})};
  const bEl=$('ric-bonuses'); bEl.innerHTML='';
  if(racaId==='humano'){ const c=document.createElement('span'); c.className='ric-bonus-chip'; c.textContent='+1 em todos os atributos'; bEl.appendChild(c); }
  else if(racaId==='meio_elfo'){['+2 Carisma','+1 em dois atributos à escolha'].forEach(t=>{const c=document.createElement('span');c.className='ric-bonus-chip';c.textContent=t;bEl.appendChild(c);});}
  else{ Object.entries(bonuses).forEach(([a,v])=>{const c=document.createElement('span');c.className='ric-bonus-chip';c.textContent=`+${v} ${attrLabel(a)}`;bEl.appendChild(c);}); }
  const traits=(sub?sub.vantagens:raca.vantagens);
  const tEl=$('ric-traits'); tEl.innerHTML='';
  traits.forEach(t=>{const d=document.createElement('div');d.className='ric-trait';d.textContent=t;tEl.appendChild(d);});
}

function onClasseChange(){ renderClassCard(this.value); }
function renderClassCard(classeId){
  const card=$('class-info-card');
  if(!classeId||!CLASSES_DATA[classeId]){card.style.display='none';return;}
  card.style.display='';
  const cls=CLASSES_DATA[classeId];
  $('cic-dice').textContent=cls.dice; $('cic-name').textContent=cls.nome; $('cic-desc').textContent=cls.descricao;
  $('cic-st').textContent=cls.savingThrows.map(attrLabel).join(' + ');
  $('cic-hp').textContent=`${cls.vidaBase} PV (${cls.dice}+CON)`;
  const sk=$('cic-skills'); sk.innerHTML='';
  cls.periciasBase.forEach(s=>{const t=document.createElement('span');t.className='cic-skill-tag';t.textContent=skillLabel(s);sk.appendChild(t);});
  const ft=$('cic-features'); ft.innerHTML='';
  cls.vantagens.forEach(v=>{const d=document.createElement('div');d.className='cic-feature';d.textContent=v;ft.appendChild(d);});
}

function onBgWizard(){
  const id=this.value, card=$('bg-preview');
  if(!id||!BACKGROUNDS_DATA[id]){card.style.display='none';return;}
  card.style.display='';
  const bg=BACKGROUNDS_DATA[id];
  $('bg-prev-name').textContent=bg.nome;
  $('bg-prev-desc').textContent=bg.descricao;
  const s=$('bg-prev-skills'); s.innerHTML='';
  bg.pericias.forEach(p=>{const c=document.createElement('span');c.className='bg-skill-chip';c.textContent=skillLabel(p);s.appendChild(c);});
}

function getActiveBonuses(){
  const racaId=$('cr-raca')?.value, subId=$('cr-subraca')?.value;
  const bonuses={};
  if(!racaId||!RACAS_DATA[racaId]) return bonuses;
  const raca=RACAS_DATA[racaId];
  Object.entries(raca.bonusAtributos).forEach(([k,v])=>{bonuses[k]=(bonuses[k]||0)+v;});
  if(subId&&raca.subraces[subId]) Object.entries(raca.subraces[subId].bonusAtributos).forEach(([k,v])=>{bonuses[k]=(bonuses[k]||0)+v;});
  return bonuses;
}

function buildAttrAssignUI(){
  const ce=$('std-array-chips'); ce.innerHTML=`<div class="std-chips-label">Valores disponíveis:</div>`;
  STANDARD_ARRAY.forEach(v=>{const c=document.createElement('div');c.className='std-chip';c.dataset.val=v;c.textContent=v;ce.appendChild(c);});
  const grid=$('attr-assign-grid'); grid.innerHTML='';
  ATTR_ORDER.forEach(attr=>{
    const row=document.createElement('div'); row.className='attr-assign-row'; row.dataset.attr=attr;
    const meta=ATTR_META[attr];
    row.innerHTML=`<div class="aar-name"><span class="aar-rune">${meta.rune}</span>${meta.label}</div>
      <select class="aar-select" id="aar-${attr}"><option value="">—</option>${STANDARD_ARRAY.map(v=>`<option value="${v}">${v}</option>`).join('')}</select>
      <div class="aar-bonus" id="aar-bonus-${attr}">—</div>
      <div class="aar-final" id="aar-final-${attr}"><span class="aar-total">—</span><span class="aar-mod"></span></div>`;
    grid.appendChild(row);
  });
  ATTR_ORDER.forEach(attr=>{
    $(`aar-${attr}`).addEventListener('change',e=>{
      wizState.attrAssign[attr]=e.target.value;
      if(e.target.value) ATTR_ORDER.forEach(o=>{ if(o!==attr&&wizState.attrAssign[o]===e.target.value){ wizState.attrAssign[o]=''; const s=$(`aar-${o}`); if(s){s.value='';s.classList.remove('assigned');} } });
      $('attr-assign-warning').style.display='none';
      refreshAttrAssign();
    });
  });
}

function refreshAttrAssign(){
  const bonuses=getActiveBonuses();
  const used=Object.values(wizState.attrAssign).filter(v=>v!=='');
  document.querySelectorAll('.std-chip').forEach(c=>c.classList.toggle('used',used.includes(c.dataset.val)));
  ATTR_ORDER.forEach(attr=>{
    const baseStr=wizState.attrAssign[attr], base=baseStr!==''?parseInt(baseStr):null;
    const bonus=bonuses[attr]||0, final=base!==null?base+bonus:null;
    const mod=final!==null?Math.floor((final-10)/2):null;
    const sel=$(`aar-${attr}`), bEl=$(`aar-bonus-${attr}`), fEl=$(`aar-final-${attr}`);
    if(sel) sel.classList.toggle('assigned',baseStr!=='');
    if(bEl){bEl.textContent=bonus>0?`+${bonus}`:bonus<0?`${bonus}`:'—';bEl.classList.toggle('has-bonus',bonus!==0);}
    if(fEl){ const tEl=fEl.querySelector('.aar-total'),mEl=fEl.querySelector('.aar-mod');
      if(final!==null){tEl.textContent=String(final);mEl.textContent=`(${formatMod(mod)})`;fEl.classList.toggle('boosted',bonus!==0);}
      else{tEl.textContent='—';mEl.textContent='';fEl.classList.remove('boosted');}
    }
  });
}

function handleCriar(){
  if(!validateStep(4)) return;
  const nome=$('cr-nome').value.trim(), racaId=$('cr-raca').value, subId=$('cr-subraca').value;
  const classeId=$('cr-classe').value, bgId=$('cr-background').value, tend=$('cr-tendencia').value;
  const raca=RACAS_DATA[racaId], classe=CLASSES_DATA[classeId];
  const bonuses=getActiveBonuses();
  let racaLabel=raca.nome; if(subId&&raca.subraces[subId]) racaLabel+=` — ${raca.subraces[subId].nome}`;
  const atributosBase={}, atributos={};
  ATTR_ORDER.forEach(a=>{const b=parseInt(wizState.attrAssign[a])||10,bo=bonuses[a]||0; atributosBase[a]=String(b); atributos[a]=String(b+bo);});
  const savingThrows={}; classe.savingThrows.forEach(st=>{savingThrows[st]=true;});
  const pericias={}; classe.periciasBase.slice(0,2).forEach(p=>{pericias[p]=true;});
  const bg=bgId?BACKGROUNDS_DATA[bgId]:null;
  if(bg) bg.pericias.forEach(p=>{pericias[p]=true;});
  const conMod=Math.floor((parseInt(atributos.constituicao)-10)/2);
  const maxPV=classe.vidaBase+conMod;
  // Idiomas da raça + antecedente
  const racaObj=RACAS_DATA[racaId], subRaca=subId?racaObj.subraces[subId]:null;
  const idiomas=[...(racaObj.idiomas||[])];
  if(bg&&bg.idiomas) bg.idiomas.forEach(i=>{ if(!i.includes('escolha')&&!idiomas.includes(i)) idiomas.push(i); });
  appData={
    personagem:{nome,raca:racaLabel,classe:classe.nome,racaId,subracaId:subId,classeId,backgroundId:bgId,tendencia:tend},
    atributos, atributosBase,
    vida:{atual:maxPV,max:maxPV,temp:0},
    combate:{nivel:1,xp:0,velocidade:racaObj.deslocamento||30,armadura:'sem_armadura',escudo:false},
    hitDice:{total:1,usados:0},
    armas:[], inventario:[], moedas:{pp:0,po:0,pe:0,pc:0},
    pericias, proficiencias:{savingThrows},
    condicoes:{}, exaustao:0, resistencias:[],
    magias:{atributo:classe.atributoConjurador||'',slots:[],slotsUsados:[],lista:[]},
    personalidade:{tracos:'',ideais:'',vinculos:'',defeitos:''},
    aparencia:{idade:'',altura:'',peso:'',olhos:'',cabelo:'',pele:''},
    idiomas, background:{id:bgId},
    inspiracao:false, observacoes:'',
  };
  // Auto-resistências raciais
  if(racaId==='tiefling') appData.resistencias.push('Fogo');
  if(racaId==='meio_orc') appData.resistencias.push('—');
  if(racaId==='draconato') appData.resistencias.push('Dano da Linhagem Dracônica');
  saveToStorage(); showApp();
}

/* ═══════════════════════════════════════════════════════════
   MOSTRAR / ESCONDER TELAS
═══════════════════════════════════════════════════════════ */
function showApp(){
  $('creation-overlay').classList.add('hidden');
  const app=$('app-wrapper'); app.style.display='flex';
  ['saving-throws-list','prof-pericias-list'].forEach(id=>{const e=$(id);if(e){e.innerHTML='';delete e.dataset.built;}});
  renderAll();
}

function showCreation(){
  $('creation-overlay').classList.remove('hidden');
  $('app-wrapper').style.display='none';
  wizState.step=1; ATTR_ORDER.forEach(a=>wizState.attrAssign[a]='');
  ['cr-nome','cr-raca','cr-classe','cr-background','cr-tendencia'].forEach(id=>{const e=$(id);if(e)e.value='';});
  updateSubracaOptions('');
  $('race-info-card').style.display='none';
  $('class-info-card').style.display='none';
  $('subraca-field').style.display='none';
  $('bg-preview').style.display='none';
  updateWizardView();
}

/* ═══════════════════════════════════════════════════════════
   ABAS
═══════════════════════════════════════════════════════════ */
function initTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   CA — cálculo automático
═══════════════════════════════════════════════════════════ */
function calcCA(){
  const armorKey=appData.combate.armadura||'sem_armadura';
  const shield=appData.combate.escudo?2:0;
  const armor=ARMOR_DATA[armorKey]||ARMOR_DATA.sem_armadura;
  const desMod=calcMod(appData.atributos.destreza)||0;
  const conMod=calcMod(appData.atributos.constituicao)||0;
  const sabMod=calcMod(appData.atributos.sabedoria)||0;
  let ca;
  if(armor.tipo==='nenhuma') ca=10+desMod;
  else if(armor.tipo==='leve') ca=armor.base+desMod;
  else if(armor.tipo==='media') ca=armor.base+Math.min(desMod,armor.maxDex);
  else if(armor.tipo==='pesada') ca=armor.base;
  else if(armor.tipo==='especial'){
    const extra=armor.extra==='con'?conMod:armor.extra==='sab'?sabMod:0;
    ca=armor.base+desMod+extra;
  } else ca=10+desMod;
  return ca+shield;
}

function calcCABreakdown(){
  const armorKey=appData.combate.armadura||'sem_armadura';
  const armor=ARMOR_DATA[armorKey]||ARMOR_DATA.sem_armadura;
  const shield=appData.combate.escudo;
  const desMod=calcMod(appData.atributos.destreza)||0;
  const conMod=calcMod(appData.atributos.constituicao)||0;
  const sabMod=calcMod(appData.atributos.sabedoria)||0;
  let parts=[];
  if(armor.tipo==='nenhuma') parts.push(`Sem armadura (10+${desMod}DES)`);
  else if(armor.tipo==='leve') parts.push(`${armor.nome} (${armor.base}+${desMod}DES)`);
  else if(armor.tipo==='media') parts.push(`${armor.nome} (${armor.base}+${Math.min(desMod,2)}DES)`);
  else if(armor.tipo==='pesada') parts.push(`${armor.nome} (${armor.base})`);
  else if(armor.tipo==='especial'){
    const extra=armor.extra==='con'?conMod:sabMod;
    const lbl=armor.extra==='con'?'CON':'SAB';
    parts.push(`${armor.nome} (10+${desMod}DES+${extra}${lbl})`);
  }
  if(shield) parts.push('Escudo (+2)');
  return parts.join(' + ')+` = ${calcCA()}`;
}

/* ═══════════════════════════════════════════════════════════
   ABA COMBATE
═══════════════════════════════════════════════════════════ */
function renderCombate(){
  const nivel=appData.combate.nivel||1;
  const ca=calcCA();
  const desMod=calcMod(appData.atributos.destreza)||0;
  const sabMod=calcMod(appData.atributos.sabedoria)||0;
  const percProf=appData.pericias['percepcao']?getProfBonus(nivel):0;
  const pp=10+sabMod+percProf;

  setEl('display-ca',ca);
  setEl('display-init',formatMod(desMod));
  setEl('display-pp',pp);
  setEl('display-pb',`+${getProfBonus(nivel)}`);
  setEl('header-char-name',appData.personagem.nome?`${esc(appData.personagem.nome)} · ${esc(appData.personagem.raca||'')} ${esc(appData.personagem.classe||'')}`.trim():'Ficha · D&D 5ª Edição');

  // Inspiração
  $('btn-inspiration').classList.toggle('active',!!appData.inspiracao);
  $('btn-inspiration').setAttribute('aria-pressed',String(!!appData.inspiracao));

  // HP
  setVal('hp-atual',appData.vida.atual||0);
  setVal('hp-max',appData.vida.max||0);
  setVal('hp-temp',appData.vida.temp||0);
  renderHPBar();

  // Hit Dice
  const classeId=appData.personagem.classeId;
  const cls=CLASSES_DATA[classeId];
  setEl('hd-type-badge',cls?cls.dice:'d8');
  setVal('hd-total',appData.hitDice.total||nivel);
  setVal('hd-usados',appData.hitDice.usados||0);
  updateHDRemaining();

  // Armadura
  setVal('armor-type',appData.combate.armadura||'sem_armadura');
  const shieldCb=$('armor-shield'); if(shieldCb) shieldCb.checked=!!appData.combate.escudo;
  setEl('ca-breakdown',calcCABreakdown());

  // Combate & progresso
  setVal('velocidade',appData.combate.velocidade||30);
  setVal('nivel-input',nivel);
  setVal('xp-input',appData.combate.xp||0);
  const nextEntry=XP_TABLE.find(e=>e.nivel===nivel+1);
  setEl('xp-next',nextEntry?`${nextEntry.xp.toLocaleString('pt-BR')} XP`:'Máximo');

  // Condições
  renderConditions();

  // Exaustão
  renderExaustao();

  // Resistências
  renderResistencias();

  // Weapons summary
  renderWeaponsSummary();
}

function renderHPBar(){
  const atual=appData.vida.atual||0, max=appData.vida.max||1;
  const pct=max>0?clamp(Math.round((atual/max)*100),0,100):0;
  const bar=$('hp-bar'), text=$('hp-bar-text'); if(!bar) return;
  bar.style.width=pct+'%';
  bar.classList.remove('mid','low');
  if(pct<=25) bar.classList.add('low'); else if(pct<=50) bar.classList.add('mid');
  let txt=`${atual} / ${max}`;
  if(appData.vida.temp>0) txt+=` (+${appData.vida.temp} tmp)`;
  text.textContent=txt;
}

function updateHDRemaining(){
  const total=parseInt($('hd-total')?.value)||1;
  const usados=parseInt($('hd-usados')?.value)||0;
  const rest=Math.max(0,total-usados);
  setEl('hd-remaining',rest);
  const rem=$('hd-remaining');
  if(rem){ rem.classList.toggle('low',rest===0); rem.classList.toggle('mid',rest>0&&rest<=Math.floor(total/2)); }
}

function renderConditions(){
  const grid=$('conditions-grid'); if(!grid) return;
  if(!grid.dataset.built){
    grid.innerHTML='';
    CONDITIONS_LIST.forEach(c=>{
      const item=document.createElement('div'); item.className='cond-item'; item.dataset.id=c.id;
      const isActive=!!appData.condicoes[c.id];
      if(isActive) item.classList.add('active');
      item.innerHTML=`<input type="checkbox" class="cond-checkbox" id="cond-${c.id}" ${isActive?'checked':''}/>
        <label for="cond-${c.id}" class="cond-label" title="${c.desc}"><span class="cond-icon">${c.icon}</span>${c.nome}</label>`;
      item.querySelector('.cond-checkbox').addEventListener('change',e=>{
        appData.condicoes[c.id]=e.target.checked;
        item.classList.toggle('active',e.target.checked);
        debouncedSave();
      });
      grid.appendChild(item);
    });
    grid.dataset.built='1';
  } else {
    CONDITIONS_LIST.forEach(c=>{
      const cb=$(`cond-${c.id}`); if(cb) cb.checked=!!appData.condicoes[c.id];
      const item=grid.querySelector(`[data-id="${c.id}"]`);
      if(item) item.classList.toggle('active',!!appData.condicoes[c.id]);
    });
  }
}

function renderExaustao(){
  const lvl=appData.exaustao||0;
  setEl('exh-level',lvl);
  setEl('exh-effect',EXHAUSTION_EFFECTS[lvl]||EXHAUSTION_EFFECTS[0]);
  const disp=$('exh-level');
  if(disp){ disp.classList.remove('exh-0','exh-1','exh-2','exh-3','exh-4','exh-5','exh-6'); disp.classList.add(`exh-${lvl}`); }
}

function renderResistencias(){
  const container=$('res-tags'); if(!container) return;
  container.innerHTML='';
  (appData.resistencias||[]).forEach((r,i)=>{
    const tag=document.createElement('span'); tag.className='res-tag';
    tag.innerHTML=`${esc(r)}<button class="res-tag-del" data-idx="${i}" aria-label="Remover">×</button>`;
    tag.querySelector('.res-tag-del').addEventListener('click',e=>{
      appData.resistencias.splice(parseInt(e.target.dataset.idx),1);
      renderResistencias(); debouncedSave();
    });
    container.appendChild(tag);
  });
}

function renderWeaponsSummary(){
  const cont=$('weapons-summary'); if(!cont) return;
  if(!appData.armas.length){cont.innerHTML='<div class="no-weapons-hint">Nenhuma arma cadastrada. Adicione na aba 🎒 Arsenal.</div>';return;}
  cont.innerHTML='';
  appData.armas.forEach(w=>{
    const attrMod=calcMod(appData.atributos[w.atributo])||0;
    const prof=w.proficiente?getProfBonus(appData.combate.nivel):0;
    const atk=attrMod+prof+(parseInt(w.bonusExtra)||0);
    const dmgMod=attrMod+(parseInt(w.bonusExtra)||0);
    const dmg=`${w.dano||'—'}${dmgMod>=0?`+${dmgMod}`:dmgMod}`;
    const card=document.createElement('div'); card.className='weapon-summary-card';
    card.innerHTML=`<div class="wscard-name">${esc(w.nome)||'Arma'}</div>
      <div class="wscard-attack"><div class="wscard-attack-label">Ataque</div><div class="wscard-attack-val">${formatMod(atk)}</div></div>
      <div class="wscard-damage"><div class="wscard-dmg-label">Dano</div><div class="wscard-dmg-val">${esc(dmg)}</div></div>`;
    cont.appendChild(card);
  });
}

function bindCombate(){
  $('hp-atual').addEventListener('change',e=>{appData.vida.atual=clamp(parseInt(e.target.value)||0,0,appData.vida.max||0);e.target.value=appData.vida.atual;renderHPBar();debouncedSave();});
  $('hp-max').addEventListener('change',e=>{appData.vida.max=Math.max(0,parseInt(e.target.value)||0);appData.vida.atual=clamp(appData.vida.atual,0,appData.vida.max);$('hp-atual').value=appData.vida.atual;renderHPBar();debouncedSave();});
  $('hp-temp').addEventListener('change',e=>{appData.vida.temp=Math.max(0,parseInt(e.target.value)||0);renderHPBar();debouncedSave();});
  $('btn-hp-dmg').addEventListener('click',()=>{
    const d=Math.abs(parseInt($('hp-delta').value)||0); if(!d)return;
    appData.vida.atual=clamp(appData.vida.atual-d,0,appData.vida.max||0);
    $('hp-atual').value=appData.vida.atual; $('hp-delta').value='';
    $('hp-bar').classList.add('hp-flash'); setTimeout(()=>$('hp-bar')?.classList.remove('hp-flash'),400);
    renderHPBar(); debouncedSave();
  });
  $('btn-hp-heal').addEventListener('click',()=>{
    const d=Math.abs(parseInt($('hp-delta').value)||0); if(!d)return;
    appData.vida.atual=clamp(appData.vida.atual+d,0,appData.vida.max||0);
    $('hp-atual').value=appData.vida.atual; $('hp-delta').value='';
    renderHPBar(); debouncedSave();
  });
  $('btn-inspiration').addEventListener('click',()=>{
    appData.inspiracao=!appData.inspiracao;
    $('btn-inspiration').classList.toggle('active',appData.inspiracao);
    $('btn-inspiration').setAttribute('aria-pressed',String(appData.inspiracao));
    debouncedSave();
  });
  // Dados de Vida
  $('hd-total').addEventListener('change',e=>{appData.hitDice.total=Math.max(1,parseInt(e.target.value)||1);updateHDRemaining();debouncedSave();});
  $('hd-usados').addEventListener('change',e=>{appData.hitDice.usados=Math.max(0,parseInt(e.target.value)||0);updateHDRemaining();debouncedSave();});
  $('btn-rest-short').addEventListener('click',()=>{
    // Descanso curto: recupera HP com dados de vida gastos (simulamos: +PV mas não rola dado)
    alert('Descanso Curto: Gaste Dados de Vida para recuperar PV (role manualmente o dado, adicione CON e atualize o HP acima).');
  });
  $('btn-rest-long').addEventListener('click',()=>{
    appData.vida.atual=appData.vida.max;
    $('hp-atual').value=appData.vida.atual; renderHPBar();
    const total=appData.hitDice.total; const used=appData.hitDice.usados;
    appData.hitDice.usados=Math.max(0,used-Math.floor(total/2));
    $('hd-usados').value=appData.hitDice.usados; updateHDRemaining();
    saveToStorage();
  });
  // Armadura
  $('armor-type').addEventListener('change',e=>{appData.combate.armadura=e.target.value;setEl('ca-breakdown',calcCABreakdown());setEl('display-ca',calcCA());debouncedSave();});
  $('armor-shield').addEventListener('change',e=>{appData.combate.escudo=e.target.checked;setEl('ca-breakdown',calcCABreakdown());setEl('display-ca',calcCA());debouncedSave();});
  // Velocidade, nível, XP
  $('velocidade').addEventListener('input',e=>{appData.combate.velocidade=parseInt(e.target.value)||30;debouncedSave();});
  $('nivel-input').addEventListener('input',e=>{
    const n=clamp(parseInt(e.target.value)||1,1,20); appData.combate.nivel=n;
    const ne=XP_TABLE.find(x=>x.nivel===n+1); setEl('xp-next',ne?`${ne.xp.toLocaleString('pt-BR')} XP`:'Máximo');
    setEl('display-pb',`+${getProfBonus(n)}`);
    renderSavingThrows(); updateAllAtributosST(); updateAllSkillMods();
    renderWeaponsSummary(); renderMagias(); renderXPTable();
    debouncedSave();
  });
  $('xp-input').addEventListener('input',e=>{appData.combate.xp=parseInt(e.target.value)||0;debouncedSave();});
  // Exaustão
  $('exh-minus').addEventListener('click',()=>{appData.exaustao=clamp((appData.exaustao||0)-1,0,6);renderExaustao();debouncedSave();});
  $('exh-plus').addEventListener('click',()=>{appData.exaustao=clamp((appData.exaustao||0)+1,0,6);renderExaustao();debouncedSave();});
  // Resistências
  const resInput=$('res-input');
  function addRes(){const v=resInput.value.trim();if(!v)return;if(!appData.resistencias.includes(v))appData.resistencias.push(v);resInput.value='';renderResistencias();debouncedSave();}
  resInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addRes();}});
}

/* ═══════════════════════════════════════════════════════════
   ABA ATRIBUTOS
═══════════════════════════════════════════════════════════ */
function renderAtributos(){
  ATTR_ORDER.forEach(attr=>{
    const input=$(attr), modEl=$(`mod-${attr}`); if(!input) return;
    input.value=appData.atributos[attr]||'';
    updateMod(modEl,input.value);
  });
}
function updateMod(modEl,value){
  if(!modEl) return;
  const mod=calcMod(value);
  modEl.textContent=formatMod(mod);
  modEl.classList.remove('positive','negative');
  if(mod!==null){ if(mod>0)modEl.classList.add('positive'); else if(mod<0)modEl.classList.add('negative'); }
}
function bindAtributos(){
  ATTR_ORDER.forEach(attr=>{
    const input=$(attr), modEl=$(`mod-${attr}`); if(!input) return;
    input.addEventListener('input',()=>{
      input.classList.remove('invalid');
      const v=parseInt(input.value);
      if(input.value!==''&&(isNaN(v)||v<1||v>30)){input.classList.add('invalid');return;}
      appData.atributos[attr]=input.value;
      updateMod(modEl,input.value);
      setEl('ca-breakdown',calcCABreakdown()); setEl('display-ca',calcCA());
      updateAllAtributosST(); renderSavingThrows(); updateAllSkillMods();
      setEl('display-init',formatMod(calcMod(appData.atributos.destreza)));
      const pp=10+(calcMod(appData.atributos.sabedoria)||0)+(appData.pericias['percepcao']?getProfBonus(appData.combate.nivel):0);
      setEl('display-pp',pp);
      renderWeaponsSummary(); renderMagias();
      debouncedSave();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   ABA PERÍCIAS — SAVING THROWS
═══════════════════════════════════════════════════════════ */
function calcST(attr,prof){
  const attrMod=Math.floor(((parseInt(appData.atributos[attr])||10)-10)/2);
  return attrMod+(prof?getProfBonus(appData.combate.nivel):0);
}
function buildSTTooltip(attr,prof){
  const attrMod=Math.floor(((parseInt(appData.atributos[attr])||10)-10)/2),pb=getProfBonus(appData.combate.nivel);
  return prof?`${formatMod(attrMod)} + ${pb} (prof) = ${formatMod(attrMod+pb)}`:`${formatMod(attrMod)} sem proficiência`;
}
function updateAllAtributosST(){
  ST_DEF.forEach(({id})=>{
    const stEl=$(`st-${id}`); if(!stEl) return;
    const prof=!!appData.proficiencias.savingThrows[id], val=calcST(id,prof), str=formatMod(val);
    if(stEl.textContent!==str){stEl.textContent=str;stEl.classList.remove('bump');void stEl.offsetWidth;stEl.classList.add('bump');}
    stEl.className=['attr-st',prof?'st-proficient':'',val>0?'positive':val<0?'negative':''].filter(Boolean).join(' ');
  });
}
function renderSavingThrows(){
  const nivel=appData.combate.nivel||1, bonus=getProfBonus(nivel);
  setEl('st-prof-bonus-display',`+${bonus}`); setEl('st-prof-nivel-display',parseInt(nivel)||1);
  const container=$('saving-throws-list'); if(!container) return;
  if(!container.dataset.built){
    container.innerHTML='';
    ST_DEF.forEach(st=>{
      const prof=!!appData.proficiencias.savingThrows[st.id], mod=calcST(st.id,prof);
      const attrMod=Math.floor(((parseInt(appData.atributos[st.id])||10)-10)/2);
      const row=document.createElement('div'); row.classList.add('st-row'); if(prof)row.classList.add('st-prof-active'); row.dataset.stId=st.id;
      row.innerHTML=`<input type="checkbox" class="st-checkbox" id="st-cb-${st.id}" ${prof?'checked':''}/>
        <span class="st-rune">${st.rune}</span><label class="st-name" for="st-cb-${st.id}">${st.nome}</label>
        <span class="st-prof-badge">PROF</span><span class="st-attr-mod" id="statmod-${st.id}">${formatMod(attrMod)}</span>
        <span class="st-mod ${mod>0?'positive':mod<0?'negative':''}" id="stmod-${st.id}">${formatMod(mod)}</span>
        <span class="st-tooltip">${buildSTTooltip(st.id,prof)}</span>`;
      row.querySelector('.st-checkbox').addEventListener('change',e=>{
        appData.proficiencias.savingThrows[st.id]=e.target.checked;
        row.classList.toggle('st-prof-active',e.target.checked);
        updateSingleST(st.id); updateAllAtributosST(); debouncedSave();
      });
      container.appendChild(row);
    });
    container.dataset.built='1';
  } else { ST_DEF.forEach(st=>updateSingleST(st.id)); }
  renderProfPericiasList();
}
function updateSingleST(id){
  const prof=!!appData.proficiencias.savingThrows[id], val=calcST(id,prof);
  const attrMod=Math.floor(((parseInt(appData.atributos[id])||10)-10)/2);
  const mEl=$(`stmod-${id}`), amEl=$(`statmod-${id}`);
  if(amEl) amEl.textContent=formatMod(attrMod);
  if(mEl&&mEl.textContent!==formatMod(val)){mEl.textContent=formatMod(val);mEl.className=`st-mod ${val>0?'positive':val<0?'negative':''}`;mEl.classList.remove('bump');void mEl.offsetWidth;mEl.classList.add('bump');}
  const ttEl=mEl?.nextElementSibling; if(ttEl) ttEl.textContent=buildSTTooltip(id,prof);
}

/* ═══════════════════════════════════════════════════════════
   ABA PERÍCIAS — SKILLS
═══════════════════════════════════════════════════════════ */
function calcSkillMod(attr,prof){
  const attrMod=Math.floor(((parseInt(appData.atributos[attr])||10)-10)/2);
  return attrMod+(prof?getProfBonus(appData.combate.nivel):0);
}
function renderProfPericiasList(){
  const container=$('prof-pericias-list'); if(!container) return;
  if(!container.dataset.built){
    container.innerHTML='';
    PERICIAS_DEF.forEach(group=>{
      const attrMod=Math.floor(((parseInt(appData.atributos[group.atributo])||10)-10)/2);
      const gEl=document.createElement('div'); gEl.classList.add('skill-group');
      gEl.innerHTML=`<div class="skill-group-header"><span class="skill-group-rune">${group.rune}</span><span class="skill-group-name">${group.grupo}</span><span class="skill-group-mod" id="sgmod-${group.atributo}">${formatMod(attrMod)}</span></div>`;
      group.pericias.forEach(skill=>{
        const isP=!!appData.pericias[skill.id], mod=calcSkillMod(group.atributo,isP);
        const row=document.createElement('div'); row.classList.add('skill-row'); row.dataset.skillId=skill.id; row.dataset.atributo=group.atributo; if(isP)row.classList.add('proficient');
        row.innerHTML=`<input type="checkbox" class="skill-checkbox" id="skill-${skill.id}" ${isP?'checked':''}/>
          <label class="skill-name" for="skill-${skill.id}">${skill.nome}</label>
          <span class="skill-prof-tag">PROF</span>
          <span class="skill-mod ${mod>0?'positive':mod<0?'negative':'zero'}" id="skmod-${skill.id}">${formatMod(mod)}</span>
          <span class="skill-tooltip">${calcSkillMod(group.atributo,isP)} pts</span>`;
        row.querySelector('.skill-checkbox').addEventListener('change',e=>{
          appData.pericias[skill.id]=e.target.checked; row.classList.toggle('proficient',e.target.checked);
          updateSingleSkill(skill.id,group.atributo);
          const pp=10+(calcMod(appData.atributos.sabedoria)||0)+(appData.pericias['percepcao']?getProfBonus(appData.combate.nivel):0);
          setEl('display-pp',pp);
          debouncedSave();
        });
        gEl.appendChild(row);
      });
      container.appendChild(gEl);
    });
    container.dataset.built='1';
  } else { updateAllSkillMods(); }
}
function updateSingleSkill(skillId,atributo){
  const prof=!!appData.pericias[skillId], mod=calcSkillMod(atributo,prof), str=formatMod(mod);
  const mEl=$(`skmod-${skillId}`);
  const row=document.querySelector(`.skill-row[data-skill-id="${skillId}"]`); if(row)row.classList.toggle('proficient',prof);
  if(mEl&&mEl.textContent!==str){mEl.textContent=str;mEl.className=`skill-mod ${mod>0?'positive':mod<0?'negative':'zero'}`;mEl.classList.remove('bump');void mEl.offsetWidth;mEl.classList.add('bump');}
}
function updateAllSkillMods(){
  PERICIAS_DEF.forEach(g=>{
    const attrMod=Math.floor(((parseInt(appData.atributos[g.atributo])||10)-10)/2);
    const sg=$(`sgmod-${g.atributo}`); if(sg)sg.textContent=formatMod(attrMod);
    g.pericias.forEach(s=>updateSingleSkill(s.id,g.atributo));
  });
}

/* ═══════════════════════════════════════════════════════════
   ABA ARSENAL — ARMAS
═══════════════════════════════════════════════════════════ */
function renderWeapons(){
  const list=$('weapons-list'), empty=$('empty-weapons');
  list.innerHTML='';
  if(!appData.armas.length){empty.style.display='flex';}
  else{empty.style.display='none';appData.armas.forEach((w,i)=>list.appendChild(createWeaponCard(w,i)));}
  renderWeaponsSummary();
}
function createWeaponCard(weapon,index){
  const attrMod=calcMod(appData.atributos[weapon.atributo])||0;
  const prof=weapon.proficiente?getProfBonus(appData.combate.nivel):0;
  const atk=attrMod+prof+(parseInt(weapon.bonusExtra)||0);
  const dmgMod=attrMod+(parseInt(weapon.bonusExtra)||0);
  const dmg=`${weapon.dano||'—'}${dmgMod>=0?`+${dmgMod}`:dmgMod}`;
  const card=document.createElement('div'); card.classList.add('weapon-card'); card.dataset.id=weapon.id;
  card.innerHTML=`
    <div class="weapon-card-header">
      <span class="weapon-num">Arma ${index+1}</span>
      <span class="weapon-title">${esc(weapon.nome)||'Sem nome'}</span>
      <button class="btn-remove-weapon" type="button" aria-label="Remover">✕</button>
    </div>
    <div class="weapon-stats-bar">
      <div class="wstat wstat-atk"><div class="wstat-label">Ataque</div><div class="wstat-val" id="wstat-atk-${weapon.id}">${formatMod(atk)}</div></div>
      <div class="wstat wstat-dmg"><div class="wstat-label">Dano</div><div class="wstat-val" id="wstat-dmg-${weapon.id}">${esc(dmg)}</div></div>
    </div>
    <div class="weapon-fields">
      <div class="field"><label>Nome</label><input type="text" value="${esc(weapon.nome)}" placeholder="Ex: Espada Longa" maxlength="40" data-field="nome" data-id="${weapon.id}"/></div>
      <div class="field"><label>Dano (dado)</label><input type="text" value="${esc(weapon.dano)}" placeholder="1d8…" maxlength="20" data-field="dano" data-id="${weapon.id}"/></div>
    </div>
    <div class="weapon-fields-row2">
      <div class="field"><label>Atributo</label>
        <select data-field="atributo" data-id="${weapon.id}">
          <option value="forca" ${weapon.atributo==='forca'?'selected':''}>Força</option>
          <option value="destreza" ${weapon.atributo==='destreza'?'selected':''}>Destreza</option>
        </select>
      </div>
      <div class="field"><label>Bônus extra</label><input type="number" value="${weapon.bonusExtra||0}" data-field="bonusExtra" data-id="${weapon.id}"/></div>
      <div class="field"><label>Proficiente</label>
        <select data-field="proficiente" data-id="${weapon.id}">
          <option value="true" ${weapon.proficiente?'selected':''}>Sim</option>
          <option value="false" ${!weapon.proficiente?'selected':''}>Não</option>
        </select>
      </div>
    </div>`;
  card.querySelector('.btn-remove-weapon').addEventListener('click',()=>{appData.armas=appData.armas.filter(w=>w.id!==weapon.id);saveToStorage();renderWeapons();});
  card.querySelectorAll('input,select').forEach(el=>{
    const upd=()=>{
      const w=appData.armas.find(x=>x.id===el.dataset.id); if(!w) return;
      const f=el.dataset.field;
      if(f==='proficiente')w[f]=el.value==='true';
      else if(f==='bonusExtra')w[f]=parseInt(el.value)||0;
      else w[f]=el.value;
      if(f==='nome'){const t=card.querySelector('.weapon-title');if(t)t.textContent=el.value||'Sem nome';}
      const wAttrMod=calcMod(appData.atributos[w.atributo])||0;
      const wProf=w.proficiente?getProfBonus(appData.combate.nivel):0;
      const wAtk=wAttrMod+wProf+(parseInt(w.bonusExtra)||0);
      const wDmgMod=wAttrMod+(parseInt(w.bonusExtra)||0);
      const wDmg=`${w.dano||'—'}${wDmgMod>=0?`+${wDmgMod}`:wDmgMod}`;
      const aEl=$(`wstat-atk-${w.id}`),dEl=$(`wstat-dmg-${w.id}`);
      if(aEl)aEl.textContent=formatMod(wAtk);if(dEl)dEl.textContent=wDmg;
      renderWeaponsSummary(); debouncedSave();
    };
    el.addEventListener('input',upd); el.addEventListener('change',upd);
  });
  return card;
}
function bindEquipamentos(){
  $('btn-add-weapon').addEventListener('click',()=>{
    const nw={id:genId(),nome:'',dano:'',atributo:'forca',proficiente:true,bonusExtra:0};
    appData.armas.push(nw); saveToStorage(); renderWeapons();
    requestAnimationFrame(()=>document.querySelector(`[data-id="${nw.id}"][data-field="nome"]`)?.focus());
  });
}

/* ═══════════════════════════════════════════════════════════
   ABA ARSENAL — MAGIAS
═══════════════════════════════════════════════════════════ */
function renderMagias(){
  const nivel=appData.combate.nivel||1;
  const attrKey=appData.magias.atributo;
  setVal('magic-attr',attrKey||'');
  const classeId=appData.personagem.classeId;
  const isWarlock=classeId==='bruxo';
  // CD de magia
  if(attrKey){
    const attrMod=calcMod(appData.atributos[attrKey])||0;
    const pb=getProfBonus(nivel);
    setEl('magic-dc',`CD ${8+pb+attrMod}`);
    setEl('magic-atk',formatMod(pb+attrMod));
  } else {
    setEl('magic-dc','—'); setEl('magic-atk','—');
  }
  // Slots por nível
  const slotsContainer=$('slots-grid'); if(!slotsContainer) return;
  slotsContainer.innerHTML='';
  let slots=[];
  if(isWarlock){
    const wSlot=WARLOCK_SLOTS[nivel]||1;
    const wCount=nivel<=1?1:nivel<=10?2:nivel<=16?3:4;
    slots=Array(wSlot).fill(wCount);
  } else if(attrKey){
    slots=SPELL_SLOTS[nivel]||[];
  }
  // Garantir array salvo
  if(!appData.magias.slots || appData.magias.slots.length!==slots.length){
    appData.magias.slots=slots.slice();
    appData.magias.slotsUsados=slots.map(()=>0);
  }
  slots.forEach((max,i)=>{
    const used=appData.magias.slotsUsados[i]||0;
    const avail=Math.max(0,max-used);
    const row=document.createElement('div'); row.className='magic-slot-row';
    const lvlNum=isWarlock?WARLOCK_SLOTS[nivel]:i+1;
    row.innerHTML=`<div class="ms-level">${lvlNum}°</div>
      <div class="ms-pips">${Array(max).fill(0).map((_,j)=>`<div class="ms-pip ${j<avail?'avail':''}" data-slot="${i}" data-pip="${j}"></div>`).join('')}</div>
      <div class="ms-text">${avail}/${max}</div>
      <button class="ms-btn-use" data-slot="${i}" type="button" title="Gastar slot" ${avail===0?'disabled':''}>−</button>
      <button class="ms-btn-restore" data-slot="${i}" type="button" title="Recuperar slot" ${used===0?'disabled':''}>+</button>`;
    row.querySelectorAll('.ms-btn-use').forEach(btn=>btn.addEventListener('click',()=>{
      const si=parseInt(btn.dataset.slot);
      appData.magias.slotsUsados[si]=Math.min(max,appData.magias.slotsUsados[si]+1);
      renderMagias(); debouncedSave();
    }));
    row.querySelectorAll('.ms-btn-restore').forEach(btn=>btn.addEventListener('click',()=>{
      const si=parseInt(btn.dataset.slot);
      appData.magias.slotsUsados[si]=Math.max(0,appData.magias.slotsUsados[si]-1);
      renderMagias(); debouncedSave();
    }));
    slotsContainer.appendChild(row);
  });
  if(!slots.length && !attrKey){
    slotsContainer.innerHTML='<div class="no-magic-hint">Selecione o atributo conjurador acima para ver os slots de magia.</div>';
  }
  // Lista de magias
  renderSpellList();
}

function renderSpellList(){
  const list=$('spell-list'); if(!list) return;
  list.innerHTML='';
  (appData.magias.lista||[]).forEach((spell,i)=>{
    const row=document.createElement('div'); row.className='spell-item';
    row.innerHTML=`<input type="checkbox" class="spell-prepared" id="sp-${i}" ${spell.preparada?'checked':''}/>
      <label for="sp-${i}" class="spell-name-label">${esc(spell.nome)}</label>
      <span class="spell-level-badge">N${spell.nivel}</span>
      <button class="btn-remove-spell" data-idx="${i}" type="button">✕</button>`;
    row.querySelector('.spell-prepared').addEventListener('change',e=>{appData.magias.lista[i].preparada=e.target.checked;debouncedSave();});
    row.querySelector('.btn-remove-spell').addEventListener('click',e=>{appData.magias.lista.splice(parseInt(e.target.dataset.idx),1);renderSpellList();debouncedSave();});
    list.appendChild(row);
  });
}

function bindMagias(){
  $('magic-attr').addEventListener('change',e=>{
    appData.magias.atributo=e.target.value;
    appData.magias.slots=[]; appData.magias.slotsUsados=[];
    renderMagias(); debouncedSave();
  });
  const spellInput=$('spell-input'), spellLevel=$('spell-level');
  function addSpell(){
    const nome=spellInput?.value.trim(); if(!nome) return;
    const nivel=parseInt(spellLevel?.value)||0;
    appData.magias.lista.push({nome,nivel,preparada:false});
    if(spellInput)spellInput.value='';
    renderSpellList(); debouncedSave();
  }
  spellInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addSpell();}});
  $('btn-add-spell')?.addEventListener('click',addSpell);
}

/* ═══════════════════════════════════════════════════════════
   ABA ARSENAL — INVENTÁRIO
═══════════════════════════════════════════════════════════ */
function renderInventario(){
  const list=$('inventory-list'), empty=$('empty-inventory');
  list.innerHTML='';
  if(!appData.inventario.length){empty.style.display='flex';}
  else{
    empty.style.display='none';
    appData.inventario.forEach((item,i)=>{
      const card=document.createElement('div'); card.classList.add('inv-item-card'); card.dataset.id=item.id;
      card.innerHTML=`
        <div class="inv-item-header">
          <span class="weapon-num">Item ${i+1}</span>
          <button class="btn-remove-item" type="button">✕</button>
        </div>
        <div class="inv-item-fields">
          <div class="field"><label>Nome</label><input type="text" value="${esc(item.nome)}" placeholder="Ex: Corda 15m…" maxlength="60" data-field="nome" data-id="${item.id}"/></div>
          <div class="field inv-qty-field"><label>Qtd.</label><input type="number" value="${item.quantidade||1}" min="0" data-field="quantidade" data-id="${item.id}"/></div>
        </div>
        <div class="inv-desc-field"><input type="text" value="${esc(item.descricao||'')}" placeholder="Descrição opcional…" maxlength="100" data-field="descricao" data-id="${item.id}"/></div>`;
      card.querySelector('.btn-remove-item').addEventListener('click',()=>{appData.inventario=appData.inventario.filter(x=>x.id!==item.id);saveToStorage();renderInventario();});
      card.querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>{
        const it=appData.inventario.find(x=>x.id===el.dataset.id); if(!it) return;
        it[el.dataset.field]=el.dataset.field==='quantidade'?parseInt(el.value)||0:el.value;
        debouncedSave();
      }));
      list.appendChild(card);
    });
  }
}
function bindInventario(){
  $('btn-add-item').addEventListener('click',()=>{
    const nw={id:genId(),nome:'',quantidade:1,descricao:''};
    appData.inventario.push(nw); saveToStorage(); renderInventario();
    requestAnimationFrame(()=>document.querySelector(`[data-id="${nw.id}"][data-field="nome"]`)?.focus());
  });
}

/* ═══════════════════════════════════════════════════════════
   ABA ARSENAL — MOEDAS
═══════════════════════════════════════════════════════════ */
function renderMoedas(){
  ['pp','po','pe','pc'].forEach(k=>setVal(`coin-${k}`,appData.moedas[k]||0));
}
function bindMoedas(){
  ['pp','po','pe','pc'].forEach(k=>{
    $(`coin-${k}`)?.addEventListener('input',e=>{appData.moedas[k]=Math.max(0,parseInt(e.target.value)||0);debouncedSave();});
  });
}

/* ═══════════════════════════════════════════════════════════
   ABA FICHA
═══════════════════════════════════════════════════════════ */
function renderFicha(){
  setVal('nome',appData.personagem.nome||'');
  setVal('raca',appData.personagem.raca||'');
  setVal('classe',appData.personagem.classe||'');
  setVal('tendencia-sel',appData.personagem.tendencia||'');
  setVal('background-sel',appData.background?.id||'');
  renderBackgroundCard(appData.background?.id||'');
  renderAppearance();
  renderIdiomas();
  renderPersonalidade();
  renderTraits();
  renderXPTable();
  const ta=$('observacoes'); if(ta){ta.value=appData.observacoes||'';setEl('char-count',ta.value.length.toLocaleString('pt-BR'));}
}

function renderBackgroundCard(bgId){
  const card=$('background-card'); if(!card) return;
  if(!bgId||!BACKGROUNDS_DATA[bgId]){card.style.display='none';return;}
  card.style.display='';
  const bg=BACKGROUNDS_DATA[bgId];
  setEl('bg-card-name',bg.nome);
  setEl('bg-card-feature',bg.caracteristica);
  setEl('bg-card-equip',`📦 ${bg.equipamento}`);
  const skillsEl=$('bg-card-skills'); if(skillsEl){
    skillsEl.innerHTML='';
    bg.pericias.forEach(p=>{const t=document.createElement('span');t.className='bg-skill-tag';t.textContent=skillLabel(p);skillsEl.appendChild(t);});
    if(bg.idiomas.length){const t=document.createElement('span');t.className='bg-skill-tag bg-lang-tag';t.textContent='🗣 '+bg.idiomas.join(', ');skillsEl.appendChild(t);}
  }
}

function renderAppearance(){
  Object.entries(appData.aparencia).forEach(([k,v])=>{const e=$(`ap-${k}`);if(e)e.value=v||'';});
}

function renderIdiomas(){
  const container=$('idioma-tags'); if(!container) return;
  container.innerHTML='';
  (appData.idiomas||[]).forEach((lang,i)=>{
    const tag=document.createElement('span'); tag.className='idioma-tag';
    tag.innerHTML=`${esc(lang)}<button class="idioma-tag-del" data-idx="${i}" aria-label="Remover">×</button>`;
    tag.querySelector('.idioma-tag-del').addEventListener('click',e=>{
      appData.idiomas.splice(parseInt(e.target.dataset.idx),1); renderIdiomas(); debouncedSave();
    });
    container.appendChild(tag);
  });
}

function renderPersonalidade(){
  ['tracos','ideais','vinculos','defeitos'].forEach(f=>{
    const e=$(f); if(e) e.value=appData.personalidade[f]||'';
  });
}

function renderTraits(){
  const container=$('traits-container'); if(!container) return;
  const racaId=appData.personagem.racaId;
  const subId=appData.personagem.subracaId;
  const classeId=appData.personagem.classeId;
  const raca=RACAS_DATA[racaId]; const sub=raca&&subId?raca.subraces[subId]:null;
  const classe=CLASSES_DATA[classeId];
  if(!raca&&!classe){container.innerHTML='<p class="traits-empty">Crie um personagem para ver as habilidades automaticamente.</p>';return;}
  container.innerHTML='';
  if(raca){
    addTraitSection(container,'🌍',sub?`${raca.nome} — ${sub.nome}`:raca.nome,sub?sub.vantagens:raca.vantagens);
    if(sub&&raca.vantagens.length) addTraitSection(container,'⚡',`Traços: ${raca.nome}`,raca.vantagens);
  }
  if(classe) addTraitSection(container,'⚔️',classe.nome,classe.vantagens);
}
function addTraitSection(container,icon,name,traits){
  const sec=document.createElement('div'); sec.className='trait-section';
  const header=document.createElement('div'); header.className='trait-section-header';
  header.innerHTML=`<span class="trait-section-icon">${icon}</span><span class="trait-section-name">${esc(name)}</span>`;
  const items=document.createElement('div'); items.className='trait-items';
  traits.forEach(t=>{const d=document.createElement('div');d.className='trait-item';d.innerHTML=`<span class="trait-text">${esc(t)}</span>`;items.appendChild(d);});
  sec.appendChild(header); sec.appendChild(items); container.appendChild(sec);
}

function renderXPTable(){
  const tbl=$('xp-table'); if(!tbl) return;
  const nivel=appData.combate.nivel||1;
  tbl.innerHTML=`<div class="xp-table-header"><div class="xp-table-cell">Nível</div><div class="xp-table-cell">XP</div><div class="xp-table-cell">Prof.</div></div>`;
  XP_TABLE.forEach(row=>{
    const div=document.createElement('div'); div.className='xp-table-row'; if(row.nivel===nivel)div.classList.add('current');
    div.innerHTML=`<div class="xp-table-cell">${row.nivel}°</div><div class="xp-table-cell">${row.xp.toLocaleString('pt-BR')}</div><div class="xp-table-cell">+${row.prof}</div>`;
    tbl.appendChild(div);
  });
}

function bindFicha(){
  ['nome','raca','classe'].forEach(f=>$(f)?.addEventListener('input',e=>{appData.personagem[f]=e.target.value;if(f==='nome')setEl('header-char-name',e.target.value||'Ficha · D&D 5ª Edição');debouncedSave();}));
  $('tendencia-sel')?.addEventListener('change',e=>{appData.personagem.tendencia=e.target.value;debouncedSave();});
  $('background-sel')?.addEventListener('change',e=>{appData.background.id=e.target.value;renderBackgroundCard(e.target.value);debouncedSave();});
  // Aparência
  Object.keys(appData.aparencia).forEach(k=>{$(`ap-${k}`)?.addEventListener('input',e=>{appData.aparencia[k]=e.target.value;debouncedSave();});});
  // Idiomas
  const idInput=$('idioma-input');
  function addIdioma(){ const v=idInput?.value.trim(); if(!v) return; if(!appData.idiomas.includes(v))appData.idiomas.push(v); if(idInput)idInput.value=''; renderIdiomas(); debouncedSave(); }
  idInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addIdioma();}});
  $('btn-add-idioma')?.addEventListener('click',addIdioma);
  // Personalidade
  ['tracos','ideais','vinculos','defeitos'].forEach(f=>$(f)?.addEventListener('input',e=>{appData.personalidade[f]=e.target.value;debouncedSave();}));
  // Notas
  $('observacoes')?.addEventListener('input',e=>{appData.observacoes=e.target.value;setEl('char-count',e.target.value.length.toLocaleString('pt-BR'));debouncedSave();});
}

/* ═══════════════════════════════════════════════════════════
   RESET / NOVO
═══════════════════════════════════════════════════════════ */
let modalMode='reset';
function bindReset(){
  const modal=$('modal-reset');

  $('btn-reset')?.addEventListener('click',()=>{
    modalMode='reset';
    $('modal-icon').textContent='⚠️';
    $('modal-title').textContent='Limpar Ficha?';
    $('modal-text').textContent='Todos os dados locais serão apagados. No servidor o personagem permanece.';
    modal.classList.add('show');
  });

  $('btn-new-char')?.addEventListener('click',()=>{
    modalMode='new';
    $('modal-icon').textContent='✨';
    $('modal-title').textContent='Novo Personagem?';
    $('modal-text').textContent='Os dados atuais serão perdidos. Criar novo personagem?';
    modal.classList.add('show');
  });

  $('btn-cancel-reset')?.addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('show');});

  $('btn-confirm-reset')?.addEventListener('click',()=>{
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('grimorio_current_char_id');
    appData=defaultData();
    currentCharId=null;
    modal.classList.remove('show');
    if(modalMode==='new'){showCreation();}
    else{
      ['saving-throws-list','prof-pericias-list','conditions-grid'].forEach(id=>{
        const e=$(id);if(e){e.innerHTML='';delete e.dataset.built;}
      });
      renderAll(); showToast('🧹 Ficha limpa');
    }
  });

  // Lista de personagens
  $('btn-char-list')?.addEventListener('click', showCharacterList);

  // Logout (botão no rodapé da ficha)
  $('btn-logout-sheet')?.addEventListener('click', handleLogout);
}

function handleLogout() {
  if(window.GrimorioAPI) window.GrimorioAPI.Auth.logout();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('grimorio_current_char_id');
  appData = defaultData();
  currentCharId = null;
  $('app-wrapper').style.display = 'none';
  $('creation-overlay').classList.add('hidden');
  $('char-list-overlay').style.display = 'none';
  $('auth-overlay').style.removeProperty('display');
  showAuthTab('login');
}

/* ═══════════════════════════════════════════════════════════
   AUTH UI
═══════════════════════════════════════════════════════════ */
function initAuth() {
  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => showAuthTab(btn.dataset.authtab));
  });

  // Login form
  $('login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = $('login-username').value.trim();
    const password = $('login-password').value;
    const errEl = $('login-error');
    errEl.style.display = 'none';

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Entrando…';

    try {
      await window.GrimorioAPI.AuthAPI.login(username, password);
      await afterLogin();
    } catch(err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false; btn.textContent = '⚔️ Entrar na Aventura';
    }
  });

  // Register form
  $('register-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = $('reg-username').value.trim();
    const password = $('reg-password').value;
    const confirm  = $('reg-confirm').value;
    const errEl    = $('register-error');
    errEl.style.display = 'none';

    if (password !== confirm) {
      errEl.textContent = 'As senhas não coincidem.';
      errEl.style.display = 'block'; return;
    }

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Criando conta…';

    try {
      await window.GrimorioAPI.AuthAPI.register(username, password);
      await afterLogin();
    } catch(err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false; btn.textContent = '📜 Criar Conta';
    }
  });

  // Token expired event
  window.addEventListener('auth:expired', () => handleLogout());
}

function showAuthTab(tab) {
  const isLogin = tab === 'login';
  $('login-form').style.display    = isLogin ? '' : 'none';
  $('register-form').style.display = isLogin ? 'none' : '';
  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.authtab === tab);
    btn.setAttribute('aria-selected', String(btn.dataset.authtab === tab));
  });
}

async function afterLogin() {
  $('auth-overlay').style.display = 'none';
  await showCharacterList();
}

/* ═══════════════════════════════════════════════════════════
   LISTA DE PERSONAGENS
═══════════════════════════════════════════════════════════ */
async function showCharacterList() {
  $('app-wrapper').style.display = 'none';
  $('creation-overlay').classList.add('hidden');
  const overlay = $('char-list-overlay');
  overlay.style.display = 'flex';

  const user = window.GrimorioAPI?.Auth.getUser();
  setEl('char-list-username', user?.username || '—');

  $('btn-logout')?.addEventListener('click', handleLogout);
  $('btn-create-new-char')?.addEventListener('click', () => {
    overlay.style.display = 'none';
    currentCharId = null;
    appData = defaultData();
    showCreation();
  });

  await renderCharacterList();
}

async function renderCharacterList() {
  const container = $('char-list-items');
  if (!container) return;

  container.innerHTML = '<div class="char-list-loading">⏳ Carregando…</div>';

  try {
    const chars = await window.GrimorioAPI.CharacterAPI.list();
    container.innerHTML = '';

    if (!chars.length) {
      container.innerHTML = '<div class="char-list-empty">Nenhum personagem criado ainda.<br>Crie o seu primeiro herói! ⚔️</div>';
      return;
    }

    chars.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div class="char-card-info">
          <div class="char-card-name">${esc(ch.nome) || 'Sem nome'}</div>
          <div class="char-card-sub">${esc(ch.raca)||'—'} · ${esc(ch.classe)||'—'} · Nível ${ch.nivel||1}</div>
          <div class="char-card-date">Editado: ${formatDate(ch.updated_at)}</div>
        </div>
        <div class="char-card-actions">
          <button class="btn btn-load-char" data-id="${ch.id}">Abrir</button>
          <button class="btn btn-del-char" data-id="${ch.id}" title="Deletar">🗑</button>
        </div>`;
      card.querySelector('.btn-load-char').addEventListener('click', () => loadCharacter(ch.id));
      card.querySelector('.btn-del-char').addEventListener('click', () => deleteCharacter(ch.id, card));
      container.appendChild(card);
    });
  } catch(err) {
    container.innerHTML = `<div class="char-list-error">❌ ${err.message}</div>`;
  }
}

async function loadCharacter(id) {
  try {
    const data = await window.GrimorioAPI.CharacterAPI.get(id);
    appData = mergeWithDefault(data);
    currentCharId = id;
    localStorage.setItem('grimorio_current_char_id', id);
    saveToLocalCache();
    $('char-list-overlay').style.display = 'none';
    ['saving-throws-list','prof-pericias-list','conditions-grid'].forEach(id=>{
      const e=$(id);if(e){e.innerHTML='';delete e.dataset.built;}
    });
    showApp();
  } catch(err) {
    alert('Erro ao carregar personagem: ' + err.message);
  }
}

async function deleteCharacter(id, cardEl) {
  if (!confirm('Deletar este personagem permanentemente?')) return;
  try {
    await window.GrimorioAPI.CharacterAPI.delete(id);
    cardEl.classList.add('char-card-removing');
    setTimeout(() => cardEl.remove(), 300);
    if (currentCharId === id) { currentCharId = null; appData = defaultData(); }
  } catch(err) {
    alert('Erro ao deletar: ' + err.message);
  }
}

function mergeWithDefault(data) {
  const d = defaultData();
  return {
    personagem:    {...d.personagem,   ...data.personagem},
    atributos:     {...d.atributos,    ...data.atributos},
    atributosBase: {...d.atributosBase,...(data.atributosBase||data.atributos)},
    vida:          {...d.vida,         ...data.vida},
    combate:       {...d.combate,      ...data.combate},
    hitDice:       {...d.hitDice,      ...data.hitDice},
    armas:         Array.isArray(data.armas)?data.armas:[],
    inventario:    Array.isArray(data.inventario)?data.inventario:[],
    moedas:        {...d.moedas,       ...data.moedas},
    pericias:      data.pericias||{},
    proficiencias: {savingThrows:data.proficiencias?.savingThrows||{}},
    condicoes:     data.condicoes||{},
    exaustao:      data.exaustao||0,
    resistencias:  Array.isArray(data.resistencias)?data.resistencias:[],
    magias:        {...d.magias,       ...data.magias},
    personalidade: {...d.personalidade,...data.personalidade},
    aparencia:     {...d.aparencia,    ...data.aparencia},
    idiomas:       Array.isArray(data.idiomas)?data.idiomas:[],
    background:    {...d.background,   ...data.background},
    inspiracao:    !!data.inspiracao,
    observacoes:   data.observacoes||'',
  };
}

function formatDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
  catch { return iso; }
}

/* ═══════════════════════════════════════════════════════════
   RENDER ALL
═══════════════════════════════════════════════════════════ */
function renderAll(){
  renderCombate();
  renderAtributos();
  renderSavingThrows();
  updateAllAtributosST();
  renderWeapons();
  renderInventario();
  renderMoedas();
  renderMagias();
  renderFicha();
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
async function init() {
  initAuth();
  initWizard();
  initTabs();
  bindCombate();
  bindAtributos();
  bindEquipamentos();
  bindInventario();
  bindMoedas();
  bindMagias();
  bindFicha();
  bindReset();

  const { Auth, AuthAPI } = window.GrimorioAPI || {};

  // Already logged in?
  if (Auth?.isLoggedIn()) {
    try {
      await AuthAPI.me(); // validate token
      const savedId = localStorage.getItem('grimorio_current_char_id');
      if (savedId) {
        try {
          await loadCharacter(parseInt(savedId));
          return;
        } catch(_) { /* fall through to character list */ }
      }
      await showCharacterList();
    } catch(_) {
      Auth.clear();
      // fall through to auth screen
    }
  }

  // Not logged in — show auth
  $('auth-overlay').style.removeProperty('display');

  console.log('%cGrimório do Aventureiro 🐉 v6.1','color:#c9a84c;font-size:1.1rem;font-weight:bold;');
  console.log('%cD&D 5E SRD · Auth + DB integrados','color:#7c5cbf;');
}

document.addEventListener('DOMContentLoaded', init);

