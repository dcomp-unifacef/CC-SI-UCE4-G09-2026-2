# Roteiro de testes — Autenticação no Frontend (Etapa 2)

## Preparação
1. O backend deve estar rodando em `http://localhost:8888` (conferir com `curl -s http://localhost:8888/`)
2. Subir o frontend em DEV: `cd front-end && npm run dev` (abrirá em http://localhost:5173)
3. Contas de teste criadas:
   - **Admin:** `admin@efc.local` / `senha-admin-123` (papel ADMIN, ajustado manualmente no banco)
   - **Aluno:** `aluno@efc.local` / `senha-aluno-123` (papel ALUNO)
   - **Admin real (seed):** o e-mail e a senha estão no `.env` do back-end, variáveis `ADMIN_EMAIL` e `ADMIN_SENHA`.

---

## Critério 1: Wilgner (seed) faz login e cai no painel admin

1. Abrir http://localhost:5173/login
2. Informar o e-mail e a senha do admin real (do `.env` do back-end)
3. Clicar em "Entrar"
4. **Esperado:** redireciona a `/` e mostra o Dashboard administrativo (AppLayout), com o menu de admin e o nome do Wilgner no rodapé da sidebar.
5. Navegar pelas telas admin (Alunos, Turmas, Financeiro, etc.).
6. **Esperado:** todas continuam funcionando normalmente, carregando dados da API.

---

## Critério 2: Recarregar a página mantém a sessão

1. Estando logado como admin, recarregar a página (F5).
2. **Esperado:** a sessão permanece (não volta ao login) e a tela admin reaparece após o carregamento.
3. Repetir com o aluno: fazer login, recarregar a página.
4. **Esperado:** a sessão do aluno também permanece.

---

## Critério 3: Sair volta ao login; abrir rota admin deslogado redireciona

### 3a) Botão "Sair"
1. Logado como admin, clicar em "Sair" (rodapé da sidebar).
2. **Esperado:** redireciona a `/login` e o localStorage perde o token (`efc_token`).
3. Repetir logado como aluno.
4. **Esperado:** mesmo comportamento.

### 3b) Rota protegida sem login
1. Fazer logout.
2. Acessar diretamente uma rota admin, por exemplo: http://localhost:5173/alunos
3. **Esperado:** redireciona automaticamente a `/login`.

---

## Critério 4: Cadastro de aluno cai no AlunoLayout; aluno logado que tenta abrir rota admin é redirecionado

### 4a) Cadastro
1. Ir a http://localhost:5173/cadastro
2. Preencher nome, e-mail (que não exista ainda), senha (mín. 8 caracteres) e confirmação.
3. Clicar em "Criar conta".
4. **Esperado:** redireciona a `/` e mostra o painel de aluno (AlunoLayout), com o nome do aluno no rodapé da sidebar e o menu de aluno.

### 4b) Aluno tenta abrir rota admin
1. Logado como aluno, acessar diretamente uma rota admin: http://localhost:5173/financeiro
2. **Esperado:** redireciona automaticamente a `/` (painel do aluno), sem mostrar a tela de admin.

---

## Critério 5: Esqueci/redefinir senha funciona de ponta a ponta

### 5a) Esqueci a senha
1. Ir a http://localhost:5173/esqueci-senha
2. Informar o e-mail de uma conta existente (por exemplo, `aluno@efc.local`).
3. Clicar em "Enviar instruções".
4. **Esperado:** mensagem de confirmação aparece ("Se o e-mail estiver cadastrado, enviaremos..."), idêntica quer o e-mail exista ou não.
5. Abrir o console do backend (terminal onde ele está rodando).
6. **Esperado:** aparecer uma linha `[DEV] Link de redefinição de senha (aluno@efc.local): http://localhost:5173/redefinir-senha?token=...`

### 5b) Redefinir a senha
1. Copiar o link do console e colar no navegador.
2. **Esperado:** tela de redefinição com dois campos de senha.
3. Informar uma nova senha (mín. 8 caracteres) e confirmar.
4. Clicar em "Redefinir senha".
5. **Esperado:** mensagem de sucesso ("Senha redefinida com sucesso!") e, após 3 segundos, redireciona automaticamente ao `/login`.
6. Fazer login com a nova senha.
7. **Esperado:** login bem-sucedido.
8. Tentar fazer login com a senha antiga.
9. **Esperado:** erro "E-mail ou senha inválidos."

### 5c) Link inválido
1. Acessar http://localhost:5173/redefinir-senha (sem `?token=`).
2. **Esperado:** mensagem "Link inválido ou expirado" e ícone de erro.

---

## Critério 6: Nenhuma chamada à API fica fora do serviço central

Conferido por grep. A busca retornou só uma ocorrência de `fetch(` no código: o `services/api.ts`. Todas as páginas importam e usam os endpoints dali (`authApi`, `alunosApi`, `campeonatosApi`, etc.).

**Evidência:**
```bash
cd front-end
grep -rn "fetch(" --include="*.tsx" --include="*.ts" src | grep -v "src/services/api.ts"
# (resultado vazio)
```

---

## Critério 7: Em build de produção, os botões de acesso rápido não existem

1. Fazer o build de produção:
   ```bash
   cd front-end
   npm run build
   ```
2. Servir o build com um servidor estático:
   ```bash
   npx serve dist -p 5555
   ```
3. Abrir http://localhost:5555/login
4. **Esperado:** o formulário de login aparece normalmente, mas **não há** a seção "Acesso rápido (DEV)" nem os botões "Admin" e "Aluno".
5. Conferir o código-fonte da página (Ctrl+U).
6. **Esperado:** não aparecer as palavras "Acesso rápido" nem os botões de `Shield` e `User2`.

---

## Testes extras

### Token no localStorage
1. Fazer login.
2. Abrir as DevTools do navegador → Application/Storage → Local Storage → http://localhost:5173
3. **Esperado:** chave `efc_token` com um JWT (3 blocos separados por `.`).
4. Fazer logout.
5. **Esperado:** a chave `efc_token` desaparece.

### Interceptor de 401
1. Fazer login.
2. Nas DevTools, copiar o valor de `efc_token`.
3. Alterar o token para um valor inválido (trocar os últimos caracteres).
4. Recarregar a página ou navegar para outra rota protegida.
5. **Esperado:** o sistema detecta o 401, limpa a sessão e redireciona ao `/login`.

### Botões de acesso rápido em DEV (com credenciais configuradas)
1. Conferir que o `.env.local` tem as variáveis `VITE_DEV_ADMIN_EMAIL`, `VITE_DEV_ADMIN_SENHA`, `VITE_DEV_ALUNO_EMAIL` e `VITE_DEV_ALUNO_SENHA`.
2. Ir ao `/login` com o frontend em DEV.
3. Clicar em "Admin" (botão de acesso rápido).
4. **Esperado:** faz login automaticamente com as credenciais do `.env.local` e redireciona ao painel admin.
5. Fazer logout e clicar em "Aluno".
6. **Esperado:** faz login automaticamente e redireciona ao painel do aluno.

### Proteção de papéis
1. Logado como admin, tentar acessar http://localhost:5173/minhas-aulas (rota de aluno).
2. **Esperado:** redireciona automaticamente a `/` (painel admin).
3. Fazer logout e logar como aluno.
4. Tentar acessar http://localhost:5173/alunos (rota admin).
5. **Esperado:** redireciona automaticamente a `/` (painel aluno).
