// ============================================================
//  Elite Fight Club — Interfaces de domínio
// ============================================================

export type Modalidade = 'Boxe' | 'Muay Thai' | 'Jiu-Jitsu' | 'Funcional'

export type Faixa =
  | 'N/A'
  | 'Iniciante'
  | 'Intermediário'
  | 'Branca'
  | 'Azul'
  | 'Roxa'
  | 'Marrom'
  | 'Preta'

export type StatusAluno = 'Ativo' | 'Inadimplente' | 'Inativo'
export type StatusPagamento = 'pago' | 'aberto' | 'atrasado'
export type StatusCampeonato =
  | 'Confirmado'
  | 'Em organização'
  | 'Inscrições abertas'
  | 'Encerrado'
export type StatusInscricao = 'inscrito' | 'confirmado' | 'desistiu'
export type StatusAula = 'agendada' | 'realizada' | 'cancelada'

export interface Aluno {
  id: string
  nome: string
  idade: number
  peso: number
  altura: number
  modalidades: Modalidade[]
  faixa: Faixa
  mensalidade: number
  status: StatusAluno
  email: string
  telefone: string
  dataMatricula: string
  fotoUrl?: string
  streak: number
}

export interface Aula {
  id: string
  diaSemana: number // 0=Dom .. 6=Sáb
  hora: string
  nome: string
  modalidade: Modalidade
  professor: string
  capacidade: number
  inscritos: number
  status: StatusAula
}

export interface Pagamento {
  id: string
  alunoId: string
  valor: number
  data: string
  forma: 'Pix' | 'Dinheiro' | 'Cartão'
  status: StatusPagamento
  referenciaMes: string
}

export interface Categoria {
  id: string
  nome: string
  pesoMin?: number
  pesoMax?: number
}

export interface Inscricao {
  alunoId: string
  categoriaId?: string
  status: StatusInscricao
}

export interface Campeonato {
  id: string
  nome: string
  data: string
  local: string
  locomocao: string
  taxaInscricao: number
  modalidades: Modalidade[]
  categorias: Categoria[]
  inscricoes: Inscricao[]
  status: StatusCampeonato
  descricao?: string
}

export interface Frequencia {
  id: string
  alunoId: string
  data: string
  hora: string
  modalidade: Modalidade
}

export interface Medicao {
  data: string
  peso: number
}

export interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'warning' | 'danger' | 'success'
  data: string
  lida: boolean
}

export interface ReceitaMensal {
  mes: string
  valor: number
}
