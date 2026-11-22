// ============================================================
//  Elite Fight Club — Camada de comunicação com o back-end
//  Todos os serviços usam VITE_API_BASE do .env.local
// ============================================================

const BASE = import.meta.env.VITE_API_BASE as string

// ----------------------------------------------------------------
// Utilitário base: lança erro com a mensagem da API
// ----------------------------------------------------------------
async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

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
// Alunos
// ----------------------------------------------------------------
export const alunosApi = {
  listar: () => request<AlunoAPI[]>('/alunos'),

  buscar: (id: number) => request<AlunoAPI>(`/alunos/${id}`),

  criar: (data: Omit<AlunoAPI, 'id'>) =>
    request<AlunoAPI>('/alunos', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<Omit<AlunoAPI, 'id'>>) =>
    request<AlunoAPI>(`/alunos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/alunos/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Campeonatos
// ----------------------------------------------------------------
export const campeonatosApi = {
  listar: () => request<CampeonatoAPI[]>('/campeonatos'),

  buscar: (id: number) => request<CampeonatoAPI>(`/campeonatos/${id}`),

  criar: (data: {
    nome: string; data: string; local: string; locomocao: string;
    valores: number; descricao: string; pesosDeLuta: string[]
  }) => request<CampeonatoAPI>('/campeonatos', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<{
    nome: string; data: string; local: string; locomocao: string;
    valores: number; descricao: string; pesosDeLuta: string[]
  }>) => request<CampeonatoAPI>(`/campeonatos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/campeonatos/${id}`, { method: 'DELETE' }),

  inscreverAluno: (campeonatoId: number, alunoId: number, pesoDeLuta: string) =>
    request<InscricaoAPI>(`/campeonatos/${campeonatoId}/inscricoes`, {
      method: 'POST',
      body: JSON.stringify({ alunoId, pesoDeLuta }),
    }),

  removerInscricao: (campeonatoId: number, alunoId: number) =>
    request<void>(`/campeonatos/${campeonatoId}/inscricoes/${alunoId}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Presenças (frequência)
// ----------------------------------------------------------------
export const presencasApi = {
  listar: () => request<PresencaAPI[]>('/presencas'),

  criar: (data: { alunoId: number; data: string; hora: string; foto?: string }) =>
    request<PresencaAPI>('/presencas', {
      method: 'POST',
      body: JSON.stringify({ foto: '', ...data }),
    }),

  excluir: (id: number) => request<void>(`/presencas/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Evoluções
// ----------------------------------------------------------------
export const evolucoesApi = {
  listar: () => request<EvolucaoAPI[]>('/evolucoes'),

  listarPorAluno: async (alunoId: number) => {
    const todas = await request<EvolucaoAPI[]>('/evolucoes')
    return todas.filter((e) => e.alunoId === alunoId)
  },

  criar: (data: { alunoId: number; pesoAtual: number; bioimpedancia: number; dataAvaliacao: string }) =>
    request<EvolucaoAPI>('/evolucoes', { method: 'POST', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/evolucoes/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Professores
// ----------------------------------------------------------------
export const professoresApi = {
  listar: () => request<ProfessorAPI[]>('/professor'),

  listarAtivos: () => request<ProfessorAPI[]>('/professor/ativos'),

  buscar: (id: number) => request<ProfessorAPI>(`/professor/${id}`),

  criar: (data: { cpf: string; nome: string; especialidade: string; contato: string; ativo?: boolean }) =>
    request<ProfessorAPI>('/professor', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; especialidade?: string; contato?: string; ativo?: boolean }) =>
    request<ProfessorAPI>(`/professor/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/professor/${id}`, { method: 'DELETE' }),

  inativar: (id: number) => request<ProfessorAPI>(`/professor/${id}/inativar`, { method: 'PATCH' }),

  reativar: (id: number) => request<ProfessorAPI>(`/professor/${id}/reativar`, { method: 'PATCH' }),
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
  listar: () => request<ModalidadeAPI[]>('/modalidades'),

  criar: (data: { nome: string; turmaId?: number }) =>
    request<ModalidadeAPI>('/modalidades', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; turmaId?: number | null }) =>
    request<ModalidadeAPI>(`/modalidades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/modalidades/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Turmas
// ----------------------------------------------------------------
export const turmasApi = {
  listar: () => request<TurmaAPI[]>('/turmas'),

  buscar: (id: number) => request<TurmaAPI>(`/turmas/${id}`),

  criar: (data: { nome: string; alunoIds?: number[] }) =>
    request<TurmaAPI>('/turmas', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: { nome?: string; alunoIds?: number[] }) =>
    request<TurmaAPI>(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/turmas/${id}`, { method: 'DELETE' }),
}

// ----------------------------------------------------------------
// Aulas
// ----------------------------------------------------------------
export const aulasApi = {
  listar: () => request<AulaAPI[]>('/aulas'),

  buscar: (id: number) => request<AulaAPI>(`/aulas/${id}`),

  criar: (data: CreateAulaInput) =>
    request<AulaAPI>('/aulas', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: number, data: Partial<CreateAulaInput>) =>
    request<AulaAPI>(`/aulas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  excluir: (id: number) => request<void>(`/aulas/${id}`, { method: 'DELETE' }),
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
  listar: () => request<FinanceiroAPI[]>('/financeiro'),

  listarPorAluno: (alunoId: number) => request<FinanceiroAPI[]>(`/financeiro/aluno/${alunoId}`),

  criar: (data: {
    alunoId: number; valor: number; referenciaMes: string
    forma?: FormaPagamento; status?: StatusPagamentoAPI
    dataPagamento?: string; observacao?: string
  }) => request<FinanceiroAPI>('/financeiro', { method: 'POST', body: JSON.stringify(data) }),

  pagar: (id: number, forma?: FormaPagamento) =>
    request<FinanceiroAPI>(`/financeiro/${id}/pagar`, { method: 'PATCH', body: JSON.stringify({ forma }) }),

  excluir: (id: number) => request<void>(`/financeiro/${id}`, { method: 'DELETE' }),
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
  listar: () => request<NotificacaoAPI[]>('/notificacoes'),

  criar: (data: { alunoId: number; tipoNotificacao: TipoNotificacao; mensagem: string }) =>
    request<NotificacaoAPI>('/notificacoes', { method: 'POST', body: JSON.stringify(data) }),

  marcarLida: (id: number) => request<NotificacaoAPI>(`/notificacoes/${id}/lida`, { method: 'PATCH' }),

  marcarTodasLidas: () =>
    request<{ atualizadas: number }>('/notificacoes/marcar-todas-lidas', { method: 'PATCH' }),

  excluir: (id: number) => request<void>(`/notificacoes/${id}`, { method: 'DELETE' }),
}
