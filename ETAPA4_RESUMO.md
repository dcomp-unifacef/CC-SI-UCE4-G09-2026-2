# ETAPA 4: ACESSO DOS ALUNOS EXISTENTES E ROTAS /aluno/me

## Parte A: Criar acesso para alunos já cadastrados

### Backend
**Novo endpoint:** `POST /alunos/:id/criar-acesso` (ADMIN)

- Validações:
  - Aluno inexistente → 404
  - Já tem acesso (usuarioId preenchido) → 409
  - Sem e-mail → 400
  - E-mail já usado por outro usuário → 409

- Funcionamento:
  1. Cria `Usuario` com papel ALUNO e senha aleatória (que o aluno não conhece)
  2. Vincula ao `Aluno` (preenche `usuarioId`)
  3. Cria token de redefinição com validade de 72 horas
  4. Tudo em transação
  5. Em DEV: imprime o link no console
  6. Em produção: devolveria o link para enviar por e-mail (se houver serviço configurado)

**Arquivos modificados (backend):**
- `src/repositories/usuarioRepository.ts` — função `criarAcessoParaAluno`
- `src/services/alunoService.ts` — função `criarAcessoParaAluno`
- `src/controllers/alunoController.ts` — função `criarAcesso`
- `src/routes/alunos.ts` — rota `POST /:id/criar-acesso`

### Frontend
**Botão "Criar acesso"** na página de Alunos:
- Aparece quando o aluno não tem `usuarioId` e tem `email`
- Ao clicar, chama a API e exibe toast de sucesso/erro
- O link aparece no toast em DEV (copiado da resposta da API)

**Arquivos modificados (frontend):**
- `src/services/api.ts` — endpoint `alunosApi.criarAcesso`
- `src/pages/Alunos.tsx` — botão e função `handleCriarAcesso`

---

## Parte B: Rotas /aluno/me

### Backend
**Novo router:** `/aluno` com `autenticar + exigirPapel('ALUNO') + carregarAluno`

- `GET /aluno/me` — retorna o perfil do aluno logado (`req.aluno`)
- `PUT /aluno/me` — atualiza o perfil com **whitelist de campos editáveis**
  - Campos permitidos: `telefone`
  - Qualquer outro campo no corpo é **ignorado** (não atualiza `status`, `mensalidade`, `cpf`, etc.)
- `GET /aluno/me/frequencia` — retorna as presenças do aluno logado

**Padrão documentado para futuros endpoints:**
- Sempre `autenticar + exigirPapel('ALUNO') + carregarAluno`
- Identificação **SEMPRE** por `req.aluno.id` (vem do token)
- **NUNCA** por id na URL, query ou corpo
- Whitelist explícita de campos editáveis no PUT

**Arquivos novos (backend):**
- `src/services/alunoMeService.ts`
- `src/controllers/alunoMeController.ts`
- `src/routes/alunoMe.ts`

**Arquivos modificados (backend):**
- `src/repositories/presencaRepository.ts` — função `findByAlunoId`
- `src/app.ts` — registrar router `/aluno`

### Frontend
**Novos endpoints no `api.ts`:**
- `alunoMeApi.obterPerfil()`
- `alunoMeApi.atualizarPerfil(dados)`
- `alunoMeApi.obterFrequencia()`

**Arquivos modificados (frontend):**
- `src/services/api.ts` — interface `AlunoMeAPI` e objeto `alunoMeApi`

---

## Critérios de aceite

### 1. Criar acesso para um aluno existente e definir a senha pelo link

**Teste:**
1. Cadastre um aluno pelo painel admin com e-mail
2. Clique em "Criar acesso" no card do aluno
3. Copie o link que aparece no toast (em DEV) ou no console do backend
4. Abra o link e defina uma senha
5. Faça login com o e-mail e a senha definida
6. **Esperado:** o aluno loga e vê o painel de aluno

**Evidência (curl):**
```bash
# 1) Criar aluno via API (simular admin)
API=http://localhost:8888
TOKEN_ADMIN=<token do admin>
ALUNO_ID=$(curl -s -X POST $API/alunos -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901","nome":"Aluno Teste","idade":25,"peso":70,"altura":1.75,"valorMensalidade":150,"graduacao":"Iniciante","email":"aluno.teste@efc.local","telefone":"11999999999","status":"ATIVO","modalidades":["Muay Thai"]}' \
  | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).id')

# 2) Criar acesso
LINK=$(curl -s -X POST $API/alunos/$ALUNO_ID/criar-acesso -H "Authorization: Bearer $TOKEN_ADMIN" | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).link')
echo "Link: $LINK"
# Extrair o token
TOKEN_RESET=$(echo "$LINK" | grep -oE 'token=[a-f0-9]{64}' | cut -d= -f2)

# 3) Redefinir senha
curl -s -X POST $API/auth/redefinir-senha -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN_RESET\",\"novaSenha\":\"senha-teste-123\"}"
# Esperado: {"message":"Senha redefinida com sucesso."}

# 4) Login
curl -s -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"aluno.teste@efc.local","senha":"senha-teste-123"}'
# Esperado: {"token":"...","usuario":{"id":...,"nome":"Aluno Teste","email":"aluno.teste@efc.local","papel":"ALUNO"}}
```

### 2. Cada aluno vê só o próprio perfil e frequência; token de admin nas rotas /aluno recebe 403

**Teste:**
```bash
# Gerar tokens de dois alunos e do admin
TOKEN_ALUNO1=<token do aluno 1>
TOKEN_ALUNO2=<token do aluno 2>
TOKEN_ADMIN=<token do admin>

# Aluno 1: ver próprio perfil
curl -s -H "Authorization: Bearer $TOKEN_ALUNO1" $API/aluno/me
# Esperado: perfil do aluno 1

# Aluno 2: ver próprio perfil
curl -s -H "Authorization: Bearer $TOKEN_ALUNO2" $API/aluno/me
# Esperado: perfil do aluno 2 (diferente do aluno 1)

# Admin: tentar acessar /aluno/me
curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN_ADMIN" $API/aluno/me
# Esperado: 403
```

### 3. PUT /aluno/me ignora campos fora da whitelist

**Teste:**
```bash
TOKEN_ALUNO=<token do aluno>

# Tentar atualizar telefone (permitido) e status (bloqueado)
curl -s -X PUT $API/aluno/me -H "Authorization: Bearer $TOKEN_ALUNO" -H "Content-Type: application/json" \
  -d '{"telefone":"11988888888","status":"INADIMPLENTE","valorMensalidade":999999}'

# Buscar o perfil de novo
PERFIL=$(curl -s -H "Authorization: Bearer $TOKEN_ALUNO" $API/aluno/me)
echo "$PERFIL" | node -p 'const p=JSON.parse(require("fs").readFileSync(0,"utf8"));`telefone=${p.telefone} status=${p.status} mensalidade=${p.valorMensalidade}`'
# Esperado: telefone=11988888888 status=ATIVO mensalidade=150 (só o telefone mudou)
```

---

## Arquivos modificados

### Backend (10)
- `src/repositories/usuarioRepository.ts`
- `src/repositories/presencaRepository.ts`
- `src/services/alunoService.ts`
- `src/services/alunoMeService.ts` (novo)
- `src/controllers/alunoController.ts`
- `src/controllers/alunoMeController.ts` (novo)
- `src/routes/alunos.ts`
- `src/routes/alunoMe.ts` (novo)
- `src/app.ts`

### Frontend (2)
- `src/services/api.ts`
- `src/pages/Alunos.tsx`

---

## Endpoints

### Admin
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/alunos/:id/criar-acesso` | Cria Usuario e token de 72h para aluno existente |

### Aluno
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/aluno/me` | Perfil do aluno logado |
| PUT | `/aluno/me` | Atualiza perfil (whitelist: telefone) |
| GET | `/aluno/me/frequencia` | Presenças do aluno logado |

---

## O que NÃO foi feito

### 1. Rotas do aluno pendentes (para próximas etapas)
- `GET /aluno/me/turmas` — turmas do aluno
- `GET /aluno/me/notificacoes` — notificações do aluno
- `PATCH /aluno/me/notificacoes/:id/lida` — marcar notificação como lida
- `GET /aluno/me/financeiro` — mensalidades do aluno
- `GET /aluno/me/campeonatos` — inscrições em campeonatos
- `GET /aluno/me/evolucoes` — evoluções do aluno
- `GET /aluno/me/aulas-particulares` — aulas particulares do aluno
- `POST /aluno/me/aulas-particulares/agendar` — agendar aula particular

### 2. Frontend das páginas do aluno
As páginas `/minhas-aulas`, `/minha-frequencia`, `/meu-financeiro`, `/meus-campeonatos`, `/minha-evolucao` ainda usam `mockData`. Dependem das rotas acima.

### 3. Envio de e-mail
O link de criação de acesso só aparece no console (DEV) ou na resposta da API. Não há envio real de e-mail. Para implementar:
- Configurar serviço de e-mail (Nodemailer, SendGrid, etc.)
- Adicionar variáveis no `.env` (SMTP_HOST, SMTP_USER, etc.)
- Enviar o link por e-mail em produção

### 4. Cadastro público não vincula aluno existente
Se um aluno já existe com e-mail `aluno@efc.local` e alguém se cadastra com esse e-mail pelo `/auth/cadastro`, um **novo** Usuario e Aluno são criados (com CPF `PENDENTE-<id>`). O aluno existente não é "assumido".

Para evitar isso, uma opção seria:
- Bloquear o cadastro público se o e-mail já existe em Aluno sem Usuario
- Mostrar mensagem "Este e-mail já está cadastrado. Entre em contato com a academia."

### 5. Mais campos editáveis pelo aluno
Hoje só `telefone` pode ser editado. Se quiser permitir que o aluno edite outros campos (peso, altura, etc.), basta adicionar à whitelist `CAMPOS_EDITAVEIS` no `alunoMeService.ts`.

### 6. Validação de CPF e e-mail
Não há validação de formato de CPF (regex, dígitos verificadores) nem de e-mail (regex). O backend aceita qualquer string.

### 7. Renovação de token expirado
Se o aluno perde o link de criação de acesso (expirou os 72h), o admin precisa criar novamente. Não há rota para reenviar.

### 8. Testes automatizados
Não há testes Jest, Mocha, etc. Só os exemplos de curl acima.

---

## Como testar

1. Suba o backend: `cd back-end-elite && npm run dev`
2. Suba o frontend: `cd front-end && npm run dev`
3. Faça login como admin no painel
4. Vá em "Alunos" e cadastre um aluno com e-mail
5. Clique em "Criar acesso" no card do aluno
6. Copie o link do toast (ou do console do backend)
7. Abra o link e defina uma senha
8. Faça logout e login como o aluno
9. **Esperado:** o aluno vê o painel de aluno e pode acessar `/aluno/me` e `/aluno/me/frequencia`

