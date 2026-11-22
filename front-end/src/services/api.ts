// ============================================================
//  Elite Fight Club — Camada de comunicação com o back-end
//  Todos os serviços usam VITE_API_BASE do .env.local
// ============================================================

const BASE = import.meta.env.VITE_API_BASE as string

// ----------------------------------------------------------------
// Utilitário base: lança erro com a mensagem da API
// ----------------------------------------------------------------
// Token management
// ----------------------------------------------------------------
let token: string | null = null
let unauthorizedHandler: (() => void) | null = null

export function getToken(): string | null {
  if (!token) token = localStorage.getItem('token')
  return token
}

export function setToken(t: string): void {
  token = t
  localStorage.setItem('token', t)
}

export function clearToken(): void {
  token = null
  localStorage.removeItem('token')
}

export function setUnauthorizedHandler(fn: () => void): void {
  unauthorizedHandler = fn
}

// ----------------------------------------------------------------
// Enhanced request with authentication
// ----------------------------------------------------------------
async function requestWithAuth<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  
  const t = getToken()
  if (t) headers['Authorization'] = `Bearer ${t}`
  
  if (options?.headers) {
    Object.assign(headers, options.headers)
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401 && unauthorizedHandler) {
    unauthorizedHandler()
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.message ?? `Erro ${res.status}`)
  }

  return data as T
}


// ----------------------------------------------------------------
// Tipos que espelham o schema do back-end
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Authentication types
// ----------------------------------------------------------------
export interface UsuarioAPI {
  id: number
  nome: string
  email: string
  papel: 'ADMIN' | 'ALUNO'
}

export interface LoginResposta {
  token: string
  usuario: UsuarioAPI
}

export interface AlunoAPI {
  id: number
  cpf: string
  nome: string
  idade: number
  peso: number
  altura: number
  valorMensalidade: number
  graduacao: string
  email?: string | null
  telefone?: string | null
  dataMatricula?: string | null
  streak: number
  status: 'ATIVO' | 'INADIMPLENTE' | 'INATIVO'
  usuarioId?: number | null
  modalidades: string[]
}

export interface CampeonatoAPI {
  id: number
  nome: string
  data: string
  local: string
  locomocao: string
  valores: number
  descricao: string
  pesosDeLuta: string[]
  inscricoes: InscricaoAPI[]
}

export interface InscricaoAPI {
  id: number
  pesoDeLuta: string
  campeonatoId: number
  alunoId: number
  aluno?: { id: number; cpf: string; nome: string }
}

export interface PresencaAPI {
  id: number
  data: string
  hora: string
  foto: string
  alunoId: number
  aluno?: { id: number; cpf: string; nome: string }
}

export interface EvolucaoAPI {
  id: number
  pesoAtual: number
  bioimpedancia: number
  dataAvaliacao: string
  alunoId: number
}

export interface ProfessorAPI {
  id: number
  cpf: string
  nome: string
  especialidade: string
  contato: string
  ativo: boolean
  aulas?: {
    id: number
    turma?: { id: number; nome: string }
    modalidade?: { id: number; nome: string }
  }[] 
}


// ----------------------------------------------------------------
// Authentication
// ----------------------------------------------------------------
export const authApi = {
  cadastro: (nome: string, email: string, senha: string) =>
    requestWithAuth<LoginResposta>('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),

  login: (email: string, senha: string) =>
    requestWithAuth<LoginResposta>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  me: () => requestWithAuth<UsuarioAPI>('/auth/me'),

  esqueciSenha: (email: string) =>
    requestWithAuth<{ message: string }>('/auth/esqueci-senha', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  redefinirSenha: (token: string, novaSenha: string) =>
    requestWithAuth<{ message: string }>('/auth/redefinir-senha', {
      method: 'POST',
      body: JSON.stringify({ token, novaSenha }),
    }),
}

// ----------------------------------------------------------------
// Alunos
// ----------------------------------------------------------------
export const alunosApi = {
  listar: () => requestWithAuth<AlunoAPI[]>('/alunos'),

  buscar: (id: number) => requestWithAuth<AlunoAPI>(`/alunos/${id}`),

  criar: (data: Omit<AlunoAPI, 'id'>) =>
    requestWithAuth<AlunoAPI>('/alunos', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<Omit<AlunoAPI, 'id'>>) =>
    requestWithAuth<AlunoAPI>(`/alunos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/alunos/${id}`, { method: 'DELETE' }),

  criarAcesso: (alunoId: number) =>
    requestWithAuth<{ message: string; link?: string }>(`/alunos/${alunoId}/criar-acesso`, {
      method: 'POST',
    }),
}

// ----------------------------------------------------------------
// Campeonatos
// ----------------------------------------------------------------
export const campeonatosApi = {
  listar: () => requestWithAuth<CampeonatoAPI[]>('/campeonatos'),

  buscar: (id: number) => requestWithAuth<CampeonatoAPI>(`/campeonatos/${id}`),

  criar: (data: {
    nome: string; data: string; local: string; locomocao: string;
    valores: number; descricao: string; pesosDeLuta: string[]
  }) => requestWithAuth<CampeonatoAPI>('/campeonatos', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<{
    nome: string; data: string; local: string; locomocao: string;
    valores: number; descricao: string; pesosDeLuta: string[]
  }>) => requestWithAuth<CampeonatoAPI>(`/campeonatos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/campeonatos/${id}`, { method: 'DELETE' }),

  inscreverAluno: (campeonatoId: number, alunoId: number, pesoDeLuta: string) =>
    requestWithAuth<InscricaoAPI>(`/campeonatos/${campeonatoId}/inscricoes`, {
      method: 'POST',
      body: JSON.stringify({ alunoId, pesoDeLuta }),
    }),

  removerInscricao: (campeonatoId: number, alunoId: number) =>
    requestWithAuth<void>(`/campeonatos/${campeonatoId}/inscricoes/${alunoId}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Presenças (frequência)
// ----------------------------------------------------------------
export const presencasApi = {
  listar: () => requestWithAuth<PresencaAPI[]>('/presencas'),

  criar: (data: { alunoId: number; data: string; hora: string; foto?: string }) =>
    requestWithAuth<PresencaAPI>('/presencas', {
      method: 'POST',
      body: JSON.stringify({ foto: '', ...data }),
    }),

  excluir: (id: number) => requestWithAuth<void>(`/presencas/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Evoluções
// ----------------------------------------------------------------
export const evolucoesApi = {
  listar: () => requestWithAuth<EvolucaoAPI[]>('/evolucoes'),

  listarPorAluno: async (alunoId: number) => {
    const todas = await requestWithAuth<EvolucaoAPI[]>('/evolucoes')
    return todas.filter((e) => e.alunoId === alunoId)
  },

  criar: (data: { alunoId: number; pesoAtual: number; bioimpedancia: number; dataAvaliacao: string }) =>
    requestWithAuth<EvolucaoAPI>('/evolucoes', { method: 'POST', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/evolucoes/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Professores
// ----------------------------------------------------------------
export const professoresApi = {
  listar: () => requestWithAuth<ProfessorAPI[]>('/professor'),

  listarAtivos: () => requestWithAuth<ProfessorAPI[]>('/professor/ativos'),

  buscar: (id: number) => requestWithAuth<ProfessorAPI>(`/professor/${id}`),

  criar: (data: { cpf: string; nome: string; especialidade: string; contato: string; ativo?: boolean }) =>
    requestWithAuth<ProfessorAPI>('/professor', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; especialidade?: string; contato?: string; ativo?: boolean }) =>
    requestWithAuth<ProfessorAPI>(`/professor/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/professor/${id}`, { method: 'DELETE' }),

  inativar: (id: number) => requestWithAuth<ProfessorAPI>(`/professor/${id}/inativar`, { method: 'PATCH' }),

  reativar: (id: number) => requestWithAuth<ProfessorAPI>(`/professor/${id}/reativar`, { method: 'PATCH' }),
}

// ----------------------------------------------------------------
// Tipos para Turmas, Aulas e Modalidades
// ----------------------------------------------------------------
export interface ModalidadeAPI {
  id: number
  nome: string
  turmaId?: number | null
}

export interface TurmaAPI {
  id: number
  nome: string
  alunos: { id: number; nome: string; cpf: string }[]
  modalidades: ModalidadeAPI[]
  aulas: AulaAPI[]
}

export interface AulaAPI {
  id: number
  data: string
  horarioInicio: string
  duracaoMinutos: number
  capacidade: number
  diaSemana: number
  presente: boolean
  observacao: string
  professorId: number
  modalidadeId: number
  turmaId: number
  professor?: ProfessorAPI
  modalidade?: ModalidadeAPI
  turma?: { id: number; nome: string }
}

export type CreateAulaInput = {
  data: string
  horarioInicio: string
  duracaoMinutos: number
  capacidade: number
  diaSemana?: number
  observacao?: string
  professorId: number
  modalidadeId: number
  turmaId: number
}

// ----------------------------------------------------------------
// Modalidades
// ----------------------------------------------------------------
export const modalidadesApi = {
  listar: () => requestWithAuth<ModalidadeAPI[]>('/modalidades'),

  criar: (data: { nome: string; turmaId?: number }) =>
    requestWithAuth<ModalidadeAPI>('/modalidades', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; turmaId?: number | null }) =>
    requestWithAuth<ModalidadeAPI>(`/modalidades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/modalidades/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Turmas
// ----------------------------------------------------------------
export const turmasApi = {
  listar: () => requestWithAuth<TurmaAPI[]>('/turmas'),

  buscar: (id: number) => requestWithAuth<TurmaAPI>(`/turmas/${id}`),

  criar: (data: { nome: string; alunoIds?: number[] }) =>
    requestWithAuth<TurmaAPI>('/turmas', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; alunoIds?: number[] }) =>
    requestWithAuth<TurmaAPI>(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/turmas/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Aulas
// ----------------------------------------------------------------
export const aulasApi = {
  listar: () => requestWithAuth<AulaAPI[]>('/aulas'),

  buscar: (id: number) => requestWithAuth<AulaAPI>(`/aulas/${id}`),

  criar: (data: CreateAulaInput) =>
    requestWithAuth<AulaAPI>('/aulas', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<CreateAulaInput>) =>
    requestWithAuth<AulaAPI>(`/aulas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => requestWithAuth<void>(`/aulas/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Financeiro
// ----------------------------------------------------------------
export type FormaPagamento = 'Pix' | 'Dinheiro' | 'Cartão'
export type StatusPagamentoAPI = 'pago' | 'aberto' | 'atrasado'

export interface FinanceiroAPI {
  id: number
  alunoId: number
  valor: number
  forma: FormaPagamento
  status: StatusPagamentoAPI
  referenciaMes: string
  dataPagamento: string
  observacao: string
  aluno?: { id: number; nome: string; cpf: string }
}

export const financeiroApi = {
  listar: () => requestWithAuth<FinanceiroAPI[]>('/financeiro'),

  listarPorAluno: (alunoId: number) => requestWithAuth<FinanceiroAPI[]>(`/financeiro/aluno/${alunoId}`),

  criar: (data: {
    alunoId: number; valor: number; referenciaMes: string
    forma?: FormaPagamento; status?: StatusPagamentoAPI
    dataPagamento?: string; observacao?: string
  }) => requestWithAuth<FinanceiroAPI>('/financeiro', { method: 'POST', body: JSON.stringify(data) }),

  pagar: (id: number, forma?: FormaPagamento) =>
    requestWithAuth<FinanceiroAPI>(`/financeiro/${id}/pagar`, { method: 'PATCH', body: JSON.stringify({ forma }) }),

  excluir: (id: number) => requestWithAuth<void>(`/financeiro/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Notificações
// ----------------------------------------------------------------
export type TipoNotificacao = 'info' | 'warning' | 'danger' | 'success'

export interface NotificacaoAPI {
  id: number
  tipoNotificacao: TipoNotificacao
  mensagem: string
  lida: boolean
  data: string
  alunoId: number
  aluno?: { id: number; nome: string }
}

export const notificacoesApi = {
  listar: () => requestWithAuth<NotificacaoAPI[]>('/notificacoes'),

  criar: (data: { alunoId: number; tipoNotificacao: TipoNotificacao; mensagem: string }) =>
    requestWithAuth<NotificacaoAPI>('/notificacoes', { method: 'POST', body: JSON.stringify(data) }),

  marcarLida: (id: number) => requestWithAuth<NotificacaoAPI>(`/notificacoes/${id}/lida`, { method: 'PATCH' }),

  marcarTodasLidas: () =>
    requestWithAuth<{ atualizadas: number }>('/notificacoes/marcar-todas-lidas', { method: 'PATCH' }),

  excluir: (id: number) => requestWithAuth<void>(`/notificacoes/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Aluno /me endpoints (authenticated student)
// ----------------------------------------------------------------
export interface AlunoMeAPI {
  id: number
  nome: string
  email: string | null
  telefone: string | null
  cpf: string
  idade: number
  peso: number
  altura: number
  valorMensalidade: number
  graduacao: string
  dataMatricula: string | null
  streak: number
  status: 'ATIVO' | 'INADIMPLENTE' | 'INATIVO'
  modalidades: string[]
  usuarioId: number | null
}

export interface InscricaoCampeonatoAPI {
  id: number
  pesoDeLuta: string
  campeonatoId: number
  alunoId: number
  campeonato: {
    id: number
    nome: string
    data: string
    local: string
    locomocao: string
    valores: number
    descricao: string
    pesosDeLuta: string[]
  }
}

export const alunoMeApi = {
  obterPerfil: () => requestWithAuth<AlunoMeAPI>('/aluno/me'),

  atualizarPerfil: (data: Partial<Pick<AlunoMeAPI, 'nome' | 'email' | 'telefone'>>) =>
    requestWithAuth<AlunoMeAPI>('/aluno/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  obterFrequencia: () => requestWithAuth<PresencaAPI[]>('/aluno/me/frequencia'),

  obterAulas: () => requestWithAuth<AulaAPI[]>('/aluno/me/aulas'),

  obterFinanceiro: () => requestWithAuth<FinanceiroAPI[]>('/aluno/me/financeiro'),

  obterEvolucoes: () => requestWithAuth<EvolucaoAPI[]>('/aluno/me/evolucoes'),

  criarEvolucao: (data: { pesoAtual: number; bioimpedancia: number; dataAvaliacao: string }) =>
    requestWithAuth<EvolucaoAPI>('/aluno/me/evolucoes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  obterCampeonatos: () => requestWithAuth<InscricaoCampeonatoAPI[]>('/aluno/me/campeonatos'),

  obterNotificacoes: () => requestWithAuth<NotificacaoAPI[]>('/aluno/me/notificacoes'),

  marcarNotificacaoLida: (id: number) =>
    requestWithAuth<NotificacaoAPI>(`/aluno/me/notificacoes/${id}/lida`, {
      method: 'PATCH',
    }),

  marcarTodasNotificacoesLidas: () =>
    requestWithAuth<{ atualizadas: number }>('/aluno/me/notificacoes/marcar-todas-lidas', {
      method: 'PATCH',
    }),
}
