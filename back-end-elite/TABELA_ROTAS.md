# Tabela de Rotas do Backend — Proteção Aplicada

| Método | Caminho | Proteção | Observação |
|--------|---------|----------|------------|
| **Públicas** |||
| GET | / | Pública | Health check |
| POST | /auth/cadastro | Pública + rate limit | Sempre cria ALUNO |
| POST | /auth/login | Pública + rate limit | |
| GET | /auth/me | Autenticada | Qualquer usuário logado |
| POST | /auth/esqueci-senha | Pública + rate limit | |
| POST | /auth/redefinir-senha | Pública + rate limit | |
| **Alunos** |||
| GET | /alunos | ADMIN | |
| GET | /alunos/:id | ADMIN | |
| POST | /alunos | ADMIN | |
| PUT | /alunos/:id | ADMIN | |
| DELETE | /alunos/:id | ADMIN | |
| **Professores** |||
| GET | /professor | ADMIN | |
| GET | /professor/ativos | ADMIN | |
| GET | /professor/:id | ADMIN | |
| POST | /professor | ADMIN | |
| PUT | /professor/:id | ADMIN | |
| DELETE | /professor/:id | ADMIN | |
| PATCH | /professor/:id/inativar | ADMIN | |
| PATCH | /professor/:id/reativar | ADMIN | |
| **Turmas** |||
| GET | /turmas | ADMIN | |
| GET | /turmas/:id | ADMIN | |
| POST | /turmas | ADMIN | |
| PUT | /turmas/:id | ADMIN | |
| DELETE | /turmas/:id | ADMIN | |
| **Aulas** |||
| GET | /aulas | ADMIN | |
| GET | /aulas/:id | ADMIN | |
| POST | /aulas | ADMIN | |
| PUT | /aulas/:id | ADMIN | |
| DELETE | /aulas/:id | ADMIN | |
| **Modalidades** |||
| GET | /modalidades | ADMIN | |
| GET | /modalidades/:id | ADMIN | |
| POST | /modalidades | ADMIN | |
| PUT | /modalidades/:id | ADMIN | |
| DELETE | /modalidades/:id | ADMIN | |
| **Campeonatos** |||
| GET | /campeonatos | ADMIN | |
| GET | /campeonatos/:id | ADMIN | |
| POST | /campeonatos | ADMIN | |
| PUT | /campeonatos/:id | ADMIN | |
| DELETE | /campeonatos/:id | ADMIN | |
| POST | /campeonatos/:id/inscricoes | ADMIN | |
| DELETE | /campeonatos/:id/inscricoes/:alunoId | ADMIN | |
| **Presenças** |||
| GET | /presencas | ADMIN | |
| GET | /presencas/:id | ADMIN | |
| POST | /presencas | ADMIN | |
| PUT | /presencas/:id | ADMIN | |
| DELETE | /presencas/:id | ADMIN | |
| **Evoluções** |||
| GET | /evolucoes | ADMIN | |
| GET | /evolucoes/:id | ADMIN | |
| POST | /evolucoes | ADMIN | |
| PUT | /evolucoes/:id | ADMIN | |
| DELETE | /evolucoes/:id | ADMIN | |
| **Financeiro** |||
| GET | /financeiro | ADMIN | |
| GET | /financeiro/aluno/:alunoId | ADMIN | Futura rota aluno: `/aluno/me/financeiro` |
| GET | /financeiro/:id | ADMIN | |
| POST | /financeiro | ADMIN | |
| PUT | /financeiro/:id | ADMIN | |
| PATCH | /financeiro/:id/pagar | ADMIN | |
| DELETE | /financeiro/:id | ADMIN | |
| **Notificações** |||
| GET | /notificacoes | ADMIN | Futura rota aluno: `/aluno/me/notificacoes` |
| GET | /notificacoes/:id | ADMIN | |
| POST | /notificacoes | ADMIN | |
| PUT | /notificacoes/:id | ADMIN | |
| PATCH | /notificacoes/:id/lida | ADMIN | Futura rota aluno: só marcar as próprias |
| PATCH | /notificacoes/marcar-todas-lidas | ADMIN | Futura rota aluno |
| DELETE | /notificacoes/:id | ADMIN | |
| **Horários** |||
| GET | /horarios | ADMIN | |
| GET | /horarios/:id | ADMIN | |
| POST | /horarios | ADMIN | |
| PUT | /horarios/:id | ADMIN | |
| DELETE | /horarios/:id | ADMIN | |
| **Aulas Particulares** |||
| GET | /aulas-particulares | ADMIN | Futura rota aluno: `/aluno/me/aulas-particulares` |
| GET | /aulas-particulares/:id | ADMIN | |
| POST | /aulas-particulares | ADMIN | |
| PUT | /aulas-particulares/:id | ADMIN | |
| DELETE | /aulas-particulares/:id | ADMIN | |
| POST | /aulas-particulares/agendar | ADMIN | Futura rota aluno |
| POST | /aulas-particulares/agendar-recorrente | ADMIN | Futura rota aluno |
| GET | /aulas-particulares/recorrencias/:id | ADMIN | Futura rota aluno |
| PATCH | /aulas-particulares/recorrencias/:id/cancelar | ADMIN | Futura rota aluno |
| PATCH | /aulas-particulares/:id/cancelar | ADMIN | Futura rota aluno |
| PATCH | /aulas-particulares/:id/registrar | ADMIN | |
| **Pessoa** |||
| GET | /pessoa | ADMIN | Entidade auxiliar |
| GET | /pessoa/:id | ADMIN | |
| POST | /pessoa | ADMIN | |
| PUT | /pessoa/:id | ADMIN | |
| DELETE | /pessoa/:id | ADMIN | |
| **Users (removido)** |||
| - | /users | Removido | Era um stub sem função |

## Resumo
- **Públicas:** 6 rotas (health check + 5 de auth)
- **ADMIN:** 91 rotas
- **Total:** 97 rotas

## Rotas que o aluno usará (etapa 4, pendente)
Hoje, o aluno **NÃO** tem rotas próprias. Tudo que ele precisa está protegido como ADMIN. Na etapa 4, criar:
- `GET /aluno/me` — dados do próprio aluno
- `GET /aluno/me/financeiro` — suas mensalidades
- `GET /aluno/me/notificacoes` — suas notificações
- `PATCH /aluno/me/notificacoes/:id/lida` — marcar sua notificação como lida
- `GET /aluno/me/aulas-particulares` — suas aulas particulares
- `POST /aluno/me/aulas-particulares/agendar` — agendar aula
- etc.
