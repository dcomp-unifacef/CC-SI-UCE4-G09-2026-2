# Requirements Document

## Introduction

Este feature implementa o CRUD completo de **Turmas** e **Aulas** no sistema administrativo
Elite Fight Club, substituindo dados mock por persistência real via API REST. Isso inclui
corrigir inconsistências existentes no backend (includes ausentes, typos em DTOs, rota
inconsistente), adicionar campos necessários ao schema Prisma, criar serviços de API no
frontend e substituir todas as páginas que consomem mocks (`Turmas.tsx`, `Modalidades.tsx`)
por integrações reais. A funcionalidade de Frequência permanece desacoplada de aulas, mas
recebe suporte a filtro por turma/modalidade como melhoria opcional.

## Glossary

- **Sistema**: A aplicação completa Elite Fight Club (backend + frontend)
- **API**: O servidor Express na porta 8888
- **Frontend**: A aplicação React na porta 5173
- **Turma**: Agrupamento de alunos com nome, lista de alunos inscritos e modalidades associadas
- **Aula**: Evento de treino com data, horário, duração, professor responsável, modalidade e turma
- **Modalidade**: Tipo de arte marcial ou treino (ex.: Muay Thai, Jiu-Jitsu); vinculada a uma Turma
- **Professor**: Instrutor cadastrado com CPF, nome, especialidade e contato
- **Aluno**: Membro da academia cadastrado no sistema
- **Presença**: Registro de check-in de um aluno em um dia específico
- **Prisma**: ORM utilizado para acesso ao banco de dados PostgreSQL
- **DTO**: Data Transfer Object — interface TypeScript que define o formato dos dados de entrada
- **Repository**: Camada de acesso a dados que executa queries Prisma
- **Service**: Camada de negócio que valida regras antes de chamar o Repository
- **Controller**: Camada Express que recebe requisições HTTP e delega ao Service
- **Mock**: Dados estáticos locais usados provisoriamente no frontend enquanto a API não está integrada

---

## Requirements

### Requirement 1: Consistência e correção do backend existente

**User Story:** Como desenvolvedor, quero que o backend de Turmas e Aulas esteja livre de
inconsistências, para que o frontend possa integrá-lo de forma confiável.

#### Acceptance Criteria

1. THE Sistema SHALL registrar a rota de aulas no prefixo `/aulas` (plural), de forma
   consistente com `/turmas`, `/modalidades` e `/presencas`.
2. THE Sistema SHALL definir `UpdateAulaDto` com os campos opcionais `modalidadeId` e
   `turmaId`, para que qualquer campo da Aula possa ser atualizado via `PUT /aulas/:id`.
3. THE Sistema SHALL definir `UpdateTurmaDto` com o campo `alunoIds` (sem o "s" adicional),
   alinhando a nomenclatura com `CreateTurmaDto`.
4. WHEN `GET /turmas` ou `GET /turmas/:id` é chamado, THE API SHALL retornar a Turma com
   os relacionamentos `alunos`, `aulas` e `modalidades` incluídos na resposta JSON.
5. WHEN `GET /aulas` ou `GET /aulas/:id` é chamado, THE API SHALL retornar a Aula com
   os relacionamentos `professor`, `modalidade` e `turma` incluídos na resposta JSON.

---

### Requirement 2: Campos adicionais no schema Prisma

**User Story:** Como administrador, quero que a Aula armazene dia da semana e capacidade
máxima, para que a grade semanal exiba informações corretas sem depender do frontend.

#### Acceptance Criteria

1. THE Prisma Schema SHALL adicionar o campo `diaSemana` (Int, 0–6, onde 0 = domingo)
   ao model `Aula`, com valor padrão 1 (segunda-feira).
2. THE Prisma Schema SHALL adicionar o campo `capacidade` (Int) ao model `Aula`,
   representando o número máximo de alunos por sessão.
3. WHEN uma Aula é criada sem o campo `diaSemana`, THE API SHALL assumir o valor padrão
   derivado do campo `data` (dia da semana da data informada).
4. IF o campo `capacidade` não for informado na criação da Aula, THEN THE API SHALL
   retornar erro 400 com mensagem descritiva.

---

### Requirement 3: CRUD de Turmas via API

**User Story:** Como administrador, quero criar, visualizar, editar e remover turmas
pelo painel, para que o cadastro de turmas seja persistido no banco de dados.

#### Acceptance Criteria

1. WHEN `POST /turmas` é chamado com `{ nome: string, alunoIds?: number[] }`,
   THE API SHALL criar a Turma no banco e retornar o objeto criado com status 201.
2. WHEN `GET /turmas` é chamado, THE API SHALL retornar a lista de todas as Turmas
   ordenadas por `nome` ascendente, com alunos e modalidades incluídos.
3. WHEN `GET /turmas/:id` é chamado com um id válido, THE API SHALL retornar a Turma
   correspondente com alunos, aulas e modalidades incluídos.
4. IF `GET /turmas/:id` é chamado com um id inexistente, THEN THE API SHALL retornar
   status 404 com mensagem "Turma não encontrada."
5. WHEN `PUT /turmas/:id` é chamado com dados válidos, THE API SHALL atualizar a Turma
   e retornar o objeto atualizado com status 200.
6. WHEN `DELETE /turmas/:id` é chamado com um id válido, THE API SHALL remover a Turma
   e retornar status 204 sem corpo.
7. IF `DELETE /turmas/:id` é chamado com um id inexistente, THEN THE API SHALL retornar
   status 404 com mensagem "Turma não encontrada."

---

### Requirement 4: CRUD de Aulas via API

**User Story:** Como administrador, quero criar, visualizar, editar e remover aulas
pelo painel, para que o cronograma semanal reflita o banco de dados.

#### Acceptance Criteria

1. WHEN `POST /aulas` é chamado com os campos obrigatórios (`data`, `horarioInicio`,
   `duracaoMinutos`, `observacao`, `professorId`, `modalidadeId`, `turmaId`, `capacidade`),
   THE API SHALL criar a Aula e retornar o objeto criado com status 201.
2. WHEN `GET /aulas` é chamado, THE API SHALL retornar a lista de todas as Aulas
   ordenadas por `data` ascendente, com `professor`, `modalidade` e `turma` incluídos.
3. WHEN `GET /aulas/:id` é chamado com um id válido, THE API SHALL retornar a Aula
   com todos os relacionamentos incluídos.
4. IF `GET /aulas/:id` é chamado com um id inexistente, THEN THE API SHALL retornar
   status 404 com mensagem "Aula não encontrada."
5. WHEN `PUT /aulas/:id` é chamado com dados válidos, THE API SHALL atualizar a Aula
   e retornar o objeto atualizado com status 200.
6. WHEN `DELETE /aulas/:id` é chamado com um id válido, THE API SHALL remover a Aula
   e retornar status 204 sem corpo.
7. IF `DELETE /aulas/:id` é chamado com um id inexistente, THEN THE API SHALL retornar
   status 404 com mensagem "Aula não encontrada."

---

### Requirement 5: Serviços de API no frontend

**User Story:** Como desenvolvedor frontend, quero funções tipadas para consumir as APIs
de Turmas, Aulas e Modalidades, para que as páginas possam integrar o backend sem
duplicar lógica de fetch.

#### Acceptance Criteria

1. THE Frontend SHALL definir a interface `TurmaAPI` com todos os campos retornados pelo
   endpoint `/turmas`, incluindo os campos aninhados de `alunos`, `aulas` e `modalidades`.
2. THE Frontend SHALL definir a interface `AulaAPI` com todos os campos retornados pelo
   endpoint `/aulas`, incluindo os campos aninhados de `professor`, `modalidade` e `turma`.
3. THE Frontend SHALL definir a interface `ModalidadeAPI` com todos os campos retornados
   pelo endpoint `/modalidades`.
4. THE Frontend SHALL exportar `turmasApi` com métodos `listar`, `buscar`, `criar`,
   `atualizar` e `excluir` que chamam os endpoints correspondentes.
5. THE Frontend SHALL exportar `aulasApi` com métodos `listar`, `buscarPorTurma`,
   `criar`, `atualizar` e `cancelar` que chamam os endpoints correspondentes.
6. THE Frontend SHALL exportar `modalidadesApi` com métodos `listar`, `criar`,
   `atualizar` e `excluir` que chamam os endpoints correspondentes.
7. WHEN qualquer método da camada de API retorna um status HTTP de erro, THE Frontend
   SHALL lançar um Error com a mensagem retornada pelo backend.

---

### Requirement 6: Página Turmas — integração com API e grade semanal

**User Story:** Como administrador, quero visualizar e gerenciar o cronograma semanal
de aulas com dados reais, para que a tela de Turmas reflita o banco de dados.

#### Acceptance Criteria

1. WHEN a página Turmas é carregada, THE Frontend SHALL buscar as aulas via
   `GET /aulas` e exibir o estado de carregamento até a resposta chegar.
2. WHEN os dados são recebidos, THE Frontend SHALL organizar as aulas em colunas
   por `diaSemana` (0–6) e ordenadas por `horarioInicio` dentro de cada coluna.
3. WHEN uma aula é exibida, THE Frontend SHALL mostrar `horarioInicio`, nome da
   turma, nome do professor e nome da modalidade usando os dados da API.
4. WHEN o administrador clica em "Cancelar" em uma aula, THE Frontend SHALL
   chamar `DELETE /aulas/:id` e, em caso de sucesso, remover a aula da grade.
5. IF a chamada a `GET /aulas` falha, THEN THE Frontend SHALL exibir uma mensagem
   de erro visível ao usuário.
6. WHEN a página é exibida com zero aulas em um dia, THE Frontend SHALL mostrar
   o estado vazio com texto "Sem aulas".

---

### Requirement 7: Formulário de criação e edição de Turma

**User Story:** Como administrador, quero criar e editar turmas pelo painel, para
que novos grupos possam ser cadastrados sem acessar o banco diretamente.

#### Acceptance Criteria

1. WHEN o administrador clica em "Nova Turma", THE Frontend SHALL exibir um
   formulário modal com campos para `nome` e seleção múltipla de alunos.
2. WHEN o formulário de Turma é submetido com `nome` preenchido, THE Frontend
   SHALL chamar `POST /turmas` e, em caso de sucesso, adicionar a turma à lista
   e fechar o modal.
3. IF o campo `nome` estiver vazio ao submeter o formulário, THEN THE Frontend
   SHALL exibir mensagem de validação sem chamar a API.
4. WHEN o administrador clica em editar uma Turma existente, THE Frontend SHALL
   abrir o formulário preenchido com os dados atuais e chamar `PUT /turmas/:id`
   ao submeter.
5. WHEN uma Turma é excluída com sucesso, THE Frontend SHALL remover a turma
   da lista e exibir uma notificação de sucesso.

---

### Requirement 8: Formulário de criação e edição de Aula

**User Story:** Como administrador, quero criar e editar aulas pelo painel, para
que o cronograma possa ser gerenciado sem acessar o banco diretamente.

#### Acceptance Criteria

1. WHEN o administrador clica em "Nova Aula", THE Frontend SHALL exibir um
   formulário modal com campos para `data`, `horarioInicio`, `duracaoMinutos`,
   `capacidade`, `observacao` e seletores de Professor, Modalidade e Turma.
2. WHEN o formulário de Aula é exibido, THE Frontend SHALL popular os seletores
   de Professor, Modalidade e Turma com dados buscados via API.
3. WHEN o formulário de Aula é submetido com todos os campos obrigatórios
   preenchidos, THE Frontend SHALL chamar `POST /aulas` e, em caso de sucesso,
   adicionar a aula à grade semanal e fechar o modal.
4. IF algum campo obrigatório estiver vazio ao submeter o formulário de Aula,
   THEN THE Frontend SHALL exibir mensagem de validação sem chamar a API.
5. WHEN o administrador edita uma Aula existente, THE Frontend SHALL abrir o
   formulário preenchido com os dados atuais e chamar `PUT /aulas/:id`
   ao submeter.

---

### Requirement 9: Integração real da página Modalidades

**User Story:** Como administrador, quero que a página de Modalidades exiba dados
reais do banco, para que contagens de alunos e aulas reflitam o estado atual.

#### Acceptance Criteria

1. WHEN a página Modalidades é carregada, THE Frontend SHALL buscar modalidades
   via `GET /modalidades` em vez de usar dados mock.
2. WHEN os dados de modalidades são recebidos, THE Frontend SHALL exibir para
   cada modalidade o nome, a quantidade de alunos inscritos na turma associada
   e a quantidade de aulas semanais cadastradas.
3. IF a chamada a `GET /modalidades` falha, THEN THE Frontend SHALL exibir uma
   mensagem de erro visível ao usuário.
