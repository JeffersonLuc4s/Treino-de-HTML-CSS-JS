# ⚔️ Grimório do Aventureiro — D&D 5E
**Ficha digital completa com autenticação e banco de dados**

---

## 📁 Estrutura do Projeto

```
dnd-app/
├── package.json              ← dependências npm
├── grimorio.db               ← criado automaticamente ao iniciar
├── server/
│   ├── index.js              ← servidor Express (ponto de entrada)
│   ├── db.js                 ← banco SQLite + criação de tabelas
│   ├── auth.js               ← bcrypt + JWT
│   └── routes/
│       ├── authRoutes.js     ← POST /api/auth/register|login  GET /api/auth/me
│       └── characterRoutes.js← GET|POST|PUT|DELETE /api/characters
└── public/
    ├── index.html            ← SPA com telas de auth, lista e ficha
    ├── style.css             ← visual dark medieval
    ├── api.js                ← fetch wrapper com JWT
    └── script.js             ← lógica da ficha + integração auth
```

---

## 🚀 Passo a Passo — Instalação

### Pré-requisitos
- **Node.js 18+** → https://nodejs.org  
  (verifique: `node --version`)

---

### Passo 1 — Criar a pasta e copiar os arquivos

```bash
mkdir dnd-app
cd dnd-app
```

Copie todos os arquivos mantendo a estrutura acima.  
Crie as pastas necessárias:

```bash
mkdir -p server/routes public
```

---

### Passo 2 — Instalar dependências

```bash
npm install
```

Isso instala:
| Pacote | Para quê |
|--------|----------|
| `express` | Servidor HTTP |
| `better-sqlite3` | Banco de dados SQLite (sem servidor extra) |
| `bcrypt` | Hash seguro de senhas |
| `jsonwebtoken` | Tokens JWT para autenticação |
| `cors` | Permite requests do frontend |

---

### Passo 3 — (Opcional) Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=coloque-uma-frase-secreta-longa-aqui-123!
NODE_ENV=production
```

> ⚠️ **Importante:** Troque o `JWT_SECRET` por algo aleatório e longo.  
> Exemplo de geração: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Para carregar o `.env`, instale o dotenv:
```bash
npm install dotenv
```
E adicione no topo do `server/index.js`:
```js
require('dotenv').config();
```

---

### Passo 4 — Iniciar o servidor

```bash
node server/index.js
```

Você verá:
```
⚔️  Grimório do Aventureiro · D&D 5E
🌐  http://localhost:3000
📦  Banco de dados: grimorio.db
✅  Servidor rodando na porta 3000
```

O arquivo `grimorio.db` é criado automaticamente com todas as tabelas.

---

### Passo 5 — Acessar no navegador

Abra: **http://localhost:3000**

A primeira tela será o **Login/Cadastro**.

---

## 🔐 Como funciona a autenticação

```
1. Usuário cria conta  →  senha é "hasheada" com bcrypt (12 rounds)
2. Servidor retorna um JWT com validade de 7 dias
3. JWT salvo no localStorage do navegador
4. Todas as requisições enviam: Authorization: Bearer <token>
5. Servidor valida o token em cada rota protegida
6. Token expirado → logout automático, redireciona para login
```

---

## 🗄️ Banco de Dados (SQLite)

O banco é um único arquivo `grimorio.db` criado automaticamente.  
**Não precisa instalar MySQL, PostgreSQL ou nada extra.**

### Tabelas criadas automaticamente:

| Tabela | Descrição |
|--------|-----------|
| `users` | id, username, password (hash), created_at |
| `characters` | dados principais do personagem |
| `attributes` | os 6 atributos + bases |
| `saving_throw_profs` | proficiências em saving throws |
| `skill_profs` | proficiências em perícias |
| `inventory` | itens do inventário |
| `weapons` | armas com cálculo de ataque |
| `spells` | magias conhecidas/preparadas |
| `conditions` | condições ativas (agarrado, cego, etc.) |
| `resistances` | resistências e imunidades |
| `magic_config` | atributo conjurador + slots usados |
| `personality` | traços, ideais, vínculos, defeitos |
| `appearance` | aparência física |
| `languages` | idiomas conhecidos |
| `coins` | moedas (PP, PO, PE, PC) |

### Ver o banco (opcional)

```bash
# Instalar o CLI do SQLite
sudo apt install sqlite3      # Linux
brew install sqlite3          # macOS

# Abrir o banco
sqlite3 grimorio.db

# Comandos úteis dentro do sqlite3:
.tables                        # listar tabelas
.schema characters             # ver estrutura da tabela
SELECT * FROM users;           # ver usuários
SELECT id, nome, classe, nivel FROM characters;
.quit
```

---

## 🌐 Rotas da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Fazer login |
| GET  | `/api/auth/me` | Ver dados do usuário logado |

### Personagens (requer token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/api/characters` | Listar personagens do usuário |
| GET    | `/api/characters/:id` | Carregar personagem completo |
| POST   | `/api/characters` | Criar novo personagem |
| PUT    | `/api/characters/:id` | Atualizar personagem |
| DELETE | `/api/characters/:id` | Deletar personagem |

### Testar a API com curl
```bash
# Cadastrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jogador1","password":"minhasenha"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jogador1","password":"minhasenha"}'

# Listar personagens (use o token retornado no login)
curl http://localhost:3000/api/characters \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🚀 Rodar em produção (VPS/servidor)

### Com PM2 (recomendado)
```bash
npm install -g pm2
pm2 start server/index.js --name grimorio
pm2 save
pm2 startup   # para iniciar automaticamente no boot
```

### Com Nginx como proxy reverso
```nginx
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backup do banco
```bash
# Copiar o arquivo é suficiente (SQLite = arquivo único)
cp grimorio.db grimorio-backup-$(date +%Y%m%d).db
```

---

## ❓ Problemas comuns

**`Cannot find module 'better-sqlite3'`**  
→ Rode `npm install` na pasta `dnd-app/`

**`Error: EADDRINUSE port 3000`**  
→ Porta em uso. Mude no `.env`: `PORT=3001`

**`JWT_SECRET` warning no console**  
→ Crie o `.env` com um secret seguro (veja Passo 3)

**Senha esquecida de usuário**  
→ Acesse o banco e delete o usuário:  
```bash
sqlite3 grimorio.db "DELETE FROM users WHERE username='nome';"
```

---

## 🔒 Segurança implementada

- ✅ Senhas com bcrypt (12 rounds) — **nunca em texto puro**
- ✅ JWT com expiração de 7 dias
- ✅ Usuário só acessa **seus próprios** personagens (verificação de `user_id`)
- ✅ Validação de input no backend
- ✅ Foreign Keys com CASCADE para evitar dados órfãos
- ✅ Resposta idêntica para usuário inexistente e senha errada (evita enumeração)
- ✅ Limite de tamanho no `express.json({ limit: '2mb' })`
